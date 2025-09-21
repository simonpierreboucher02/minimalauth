import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { insertAppSchema, insertBlogPostSchema, insertUserAppCredentialSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth } from "./auth";

// Extend session type
declare module 'express-session' {
  interface SessionData {
    isAdmin?: boolean;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup user authentication (includes session configuration)
  setupAuth(app);

  // Admin login endpoint - REMOVED for security
  // Use proper user role-based authentication instead of hardcoded credentials
  app.post("/api/admin/login", async (req, res) => {
    res.status(404).json({ success: false, message: "Admin endpoint disabled for security" });
  });

  // Admin logout endpoint
  app.post("/api/admin/logout", async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ success: false, message: "Could not log out" });
      } else {
        res.json({ success: true, message: "Logout successful" });
      }
    });
  });

  // Check admin auth status
  app.get("/api/admin/status", async (req, res) => {
    res.json({ isAdmin: !!req.session.isAdmin });
  });

  // Middleware to check admin authentication
  const requireAdmin = (req: any, res: any, next: any) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ message: "Admin authentication required" });
    }
    next();
  };

  // Middleware to check user authentication
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // Get all apps (public endpoint)
  app.get("/api/apps", async (req, res) => {
    try {
      const apps = await storage.getAllApps();
      res.json(apps);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch apps" });
    }
  });

  // Get single app (public endpoint)
  app.get("/api/apps/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const app = await storage.getApp(id);
      
      if (!app) {
        return res.status(404).json({ message: "App not found" });
      }
      
      res.json(app);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch app" });
    }
  });

  // Create new app (admin only)
  app.post("/api/apps", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertAppSchema.parse(req.body);
      const app = await storage.createApp(validatedData);
      res.status(201).json(app);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid app data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create app" });
      }
    }
  });

  // Update app (admin only)
  app.patch("/api/apps/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertAppSchema.partial().parse(req.body);
      const app = await storage.updateApp(id, validatedData);
      
      if (!app) {
        return res.status(404).json({ message: "App not found" });
      }
      
      res.json(app);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid app data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update app" });
      }
    }
  });

  // Delete app (admin only)
  app.delete("/api/apps/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteApp(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "App not found" });
      }
      
      res.json({ message: "App deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete app" });
    }
  });

  // Record app visit (public endpoint)
  app.post("/api/apps/:id/visit", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.recordAppVisit(id);
      res.json({ message: "Visit recorded" });
    } catch (error) {
      res.status(500).json({ message: "Failed to record visit" });
    }
  });

  // Get app statistics (admin only)
  app.get("/api/apps/:id/stats", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const stats = await storage.getAppStats(id);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch app stats" });
    }
  });

  // Blog post endpoints
  // Get published blog posts (public)
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  // Get all blog posts (admin only)
  app.get("/api/admin/blog", requireAdmin, async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  // Get single blog post by slug (public)
  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post || !post.published) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Create blog post (admin only)
  app.post("/api/admin/blog", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid blog post data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create blog post" });
      }
    }
  });

  // Update blog post (admin only)
  app.patch("/api/admin/blog/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(id, validatedData);
      
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid blog post data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update blog post" });
      }
    }
  });

  // Delete blog post (admin only)
  app.delete("/api/admin/blog/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBlogPost(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // === USER APP CREDENTIALS ROUTES ===
  
  // Get user's app credentials
  app.get("/api/user/credentials", requireAuth, async (req, res) => {
    try {
      const credentials = await storage.getUserAppCredentials(req.user!.id);
      
      // Return encrypted credentials - client will decrypt with recovery key
      res.json(credentials);
    } catch (error) {
      console.error('Error fetching user credentials:', error);
      res.status(500).json({ message: "Failed to fetch credentials" });
    }
  });

  // Get single app credential for user
  app.get("/api/user/credentials/:appId", requireAuth, async (req, res) => {
    try {
      const appId = parseInt(req.params.appId);
      const credential = await storage.getUserAppCredential(req.user!.id, appId);
      
      if (!credential) {
        return res.status(404).json({ message: "Credential not found" });
      }

      // Return encrypted credential - client will decrypt with recovery key
      res.json(credential);
    } catch (error) {
      console.error('Error fetching credential:', error);
      res.status(500).json({ message: "Failed to fetch credential" });
    }
  });

  // Create or update app credential for user
  app.post("/api/user/credentials", requireAuth, async (req, res) => {
    try {
      const validatedData = insertUserAppCredentialSchema.parse(req.body);
      
      // Check if credential already exists
      const existingCredential = await storage.getUserAppCredential(req.user!.id, validatedData.appId);
      
      if (existingCredential) {
        // Update existing credential
        // Password comes pre-encrypted from client
        const updatedCredential = await storage.updateUserAppCredential(existingCredential.id, validatedData);
        
        const decryptedCredential = {
          ...updatedCredential!,
          appPassword: validatedData.appPassword // Return original password
        };
        
        res.json(decryptedCredential);
      } else {
        // Create new credential
        // Password comes pre-encrypted from client
        const credential = await storage.createUserAppCredential({
          ...validatedData,
          userId: req.user!.id
        });
        
        const decryptedCredential = {
          ...credential,
          appPassword: validatedData.appPassword // Return original password
        };
        
        res.status(201).json(decryptedCredential);
      }
    } catch (error) {
      console.error('Error saving credential:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid credential data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to save credential" });
      }
    }
  });

  // Update app credential
  app.patch("/api/user/credentials/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertUserAppCredentialSchema.partial().parse(req.body);
      
      // Check ownership
      const existingCredential = await storage.getUserAppCredentials(req.user!.id);
      const isOwner = existingCredential.some(cred => cred.id === id);
      
      if (!isOwner) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Password comes pre-encrypted from client
      const credential = await storage.updateUserAppCredential(id, validatedData);
      
      if (!credential) {
        return res.status(404).json({ message: "Credential not found" });
      }

      // Return encrypted credential - client will decrypt with recovery key
      res.json(credential);
    } catch (error) {
      console.error('Error updating credential:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid credential data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update credential" });
      }
    }
  });

  // Get user encryption key material for client-side E2EE
  app.get("/api/user/key", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return encrypted key material for client-side decryption
      res.json({
        encryptionKey: user.encryptionKey,
        kdfSalt: user.kdfSalt
      });
    } catch (error) {
      console.error('Error fetching user key material:', error);
      res.status(500).json({ message: "Failed to fetch key material" });
    }
  });

  // Delete app credential
  app.delete("/api/user/credentials/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Check ownership
      const existingCredentials = await storage.getUserAppCredentials(req.user!.id);
      const isOwner = existingCredentials.some(cred => cred.id === id);
      
      if (!isOwner) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const deleted = await storage.deleteUserAppCredential(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Credential not found" });
      }
      
      res.json({ message: "Credential deleted successfully" });
    } catch (error) {
      console.error('Error deleting credential:', error);
      res.status(500).json({ message: "Failed to delete credential" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
