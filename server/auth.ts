import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import * as crypto from "crypto";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as UserType } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends UserType {}
  }
}

const scryptAsync = promisify(scrypt);

// Secure generation of recovery key using cryptographically secure random bytes
export function generateRecoveryKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const randomBuffer = randomBytes(24); // 24 bytes for 24 characters
  let result = '';
  
  for (let i = 0; i < 6; i++) {
    if (i > 0) result += '-';
    for (let j = 0; j < 4; j++) {
      const index = randomBuffer[i * 4 + j] % chars.length;
      result += chars.charAt(index);
    }
  }
  
  return result;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Hash recovery key for secure storage
export async function hashRecoveryKey(recoveryKey: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(recoveryKey, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Verify recovery key against stored hash
export async function verifyRecoveryKey(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Generate and encrypt user encryption key
export async function generateUserEncryptionKey(recoveryKey: string): Promise<{
  encryptedKey: string;
  kdfSalt: string;
}> {
  // Generate a strong random encryption key for the user
  const userKey = randomBytes(32);
  const kdfSalt = randomBytes(16);
  
  // Derive a key from recovery key to encrypt the user's encryption key
  const derivedKey = (await scryptAsync(recoveryKey, kdfSalt, 32)) as Buffer;
  
  // Encrypt the user's encryption key with AES-256-GCM
  const iv = randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', derivedKey, iv);
  const encrypted = Buffer.concat([
    cipher.update(userKey),
    cipher.final()
  ]);
  const tag = cipher.getAuthTag();
  
  const encryptedKey = `${iv.toString('hex')}.${encrypted.toString('hex')}.${tag.toString('hex')}`;
  
  return {
    encryptedKey,
    kdfSalt: kdfSalt.toString('hex')
  };
}

// Decrypt user encryption key using recovery key
// Moved to internal - no external access needed
async function decryptUserEncryptionKey(
  encryptedKey: string, 
  recoveryKey: string, 
  kdfSalt: string
): Promise<Buffer> {
  const [ivHex, encrypted, tagHex] = encryptedKey.split('.');
  if (!ivHex || !encrypted || !tagHex) {
    throw new Error('Invalid encrypted key format');
  }
  
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const salt = Buffer.from(kdfSalt, 'hex');
  
  // Derive the same key from recovery key
  const derivedKey = (await scryptAsync(recoveryKey, salt, 32)) as Buffer;
  
  const decipher = crypto.createDecipheriv('aes-256-gcm', derivedKey, iv);
  decipher.setAuthTag(tag);
  
  let decrypted = decipher.update(encrypted, 'hex');
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted;
}

// Secure encryption for app passwords using user's encryption key
// Moved to internal - use client-side encryption only
async function encryptAppPassword(password: string, userEncryptionKey: Buffer): Promise<string> {
  const algorithm = 'aes-256-gcm';
  const iv = randomBytes(12); // 12 bytes for GCM
  
  const cipher = crypto.createCipheriv(algorithm, userEncryptionKey, iv);
  cipher.setAAD(Buffer.from('app-password'));
  
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}.${encrypted}.${tag.toString('hex')}`;
}

// Moved to internal - use client-side decryption only  
async function decryptAppPassword(encryptedPassword: string, userEncryptionKey: Buffer): Promise<string> {
  const algorithm = 'aes-256-gcm';
  
  const [ivHex, encrypted, tagHex] = encryptedPassword.split('.');
  if (!ivHex || !encrypted || !tagHex) {
    throw new Error('Invalid encrypted password format');
  }
  
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  
  const decipher = crypto.createDecipheriv(algorithm, userEncryptionKey, iv);
  decipher.setAAD(Buffer.from('app-password'));
  decipher.setAuthTag(tag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

export function setupAuth(app: Express) {
  // Validate required environment variables
  if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is required');
  }

  const isProduction = process.env.NODE_ENV === 'production';
  
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: isProduction, // HTTPS only in production
      httpOnly: true,
      sameSite: 'lax', // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false, { message: 'Invalid username or password' });
        }
        
        // Update last login
        await storage.updateUserLastLogin(user.id);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    console.log('Serializing user:', user.id);
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: string, done) => {
    try {
      console.log('Deserializing user ID:', id);
      const user = await storage.getUser(id);
      console.log('Found user:', user ? user.username : 'not found');
      done(null, user);
    } catch (error) {
      console.error('Deserialize error:', error);
      done(error);
    }
  });

  // Registration endpoint
  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, password, email } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const recoveryKey = generateRecoveryKey();
      const hashedPassword = await hashPassword(password);
      const recoveryKeyHash = await hashRecoveryKey(recoveryKey);
      const { encryptedKey, kdfSalt } = await generateUserEncryptionKey(recoveryKey);

      const user = await storage.createUser({
        username,
        password: hashedPassword,
        email: email || undefined,
        recoveryKeyHash,
        encryptionKey: encryptedKey,
        kdfSalt,
      });

      req.login(user, (err) => {
        if (err) return next(err);
        
        // Regenerate session for security
        req.session.regenerate((sessionErr) => {
          if (sessionErr) {
            console.error('Session regeneration error:', sessionErr);
            return res.status(500).json({ message: "Registration failed" });
          }
          
          req.session.save((saveErr) => {
            if (saveErr) {
              console.error('Session save error:', saveErr);
              return res.status(500).json({ message: "Registration failed" });
            }
            
            res.status(201).json({ 
              success: true,
              user: { id: user.id, username: user.username, email: user.email },
              recoveryKey // Return recovery key on registration only
            });
          });
        });
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Login endpoint
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    console.log('Login successful for user:', req.user?.id);
    
    // Force Passport to serialize user to session
    req.logIn(req.user!, (loginErr) => {
      if (loginErr) {
        console.error('Login serialize error:', loginErr);
        return res.status(500).json({ message: "Login failed" });
      }
      
      // Save the session with the user data
      req.session.save((saveErr) => {
        if (saveErr) {
          console.error('Session save error:', saveErr);
          return res.status(500).json({ message: "Login failed" });
        }
        
        console.log('Session saved successfully');
        res.status(200).json({
          success: true,
          user: { 
            id: req.user!.id, 
            username: req.user!.username, 
            email: req.user!.email 
          }
        });
      });
    });
  });

  // Password reset disabled for zero-trust E2EE security
  // Users must use their recovery key to create a new account if password is lost
  app.post("/api/reset-password", async (req, res) => {
    res.status(501).json({ 
      message: "Password reset via server is disabled for security. Please create a new account using your recovery key if you've lost your password.",
      hint: "MinimalAuth follows zero-trust principles - only you have access to your recovery key"
    });
  });

  // Logout endpoint
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  // Get current user
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.sendStatus(401);
    }
    
    res.json({
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      createdAt: req.user.createdAt,
      lastLoginAt: req.user.lastLoginAt,
    });
  });
}