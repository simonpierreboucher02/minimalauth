import { 
  type User, 
  type InsertUser, 
  type App, 
  type InsertApp,
  type BlogPost,
  type InsertBlogPost,
  type AppStats,
  type InsertAppStats,
  type UserAppCredential,
  type InsertUserAppCredential,
  apps,
  users,
  blogPosts,
  appStats,
  userAppCredentials
} from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser & { recoveryKeyHash: string; encryptionKey: string; kdfSalt: string }): Promise<User>;
  updateUserPassword(id: string, password: string): Promise<boolean>;
  updateUserLastLogin(id: string): Promise<boolean>;
  
  // User app credentials management
  getUserAppCredentials(userId: string): Promise<UserAppCredential[]>;
  getUserAppCredential(userId: string, appId: number): Promise<UserAppCredential | undefined>;
  createUserAppCredential(credential: InsertUserAppCredential & { userId: string }): Promise<UserAppCredential>;
  updateUserAppCredential(id: number, credential: Partial<InsertUserAppCredential>): Promise<UserAppCredential | undefined>;
  deleteUserAppCredential(id: number): Promise<boolean>;
  
  // App management
  getAllApps(): Promise<App[]>;
  getApp(id: number): Promise<App | undefined>;
  createApp(app: InsertApp): Promise<App>;
  updateApp(id: number, app: Partial<InsertApp>): Promise<App | undefined>;
  deleteApp(id: number): Promise<boolean>;
  recordAppVisit(appId: number): Promise<void>;
  getAppStats(appId: number): Promise<AppStats[]>;
  
  // Blog management
  getAllBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  
  // Session store for authentication
  sessionStore: any;
}

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
    });
    this.initializeDefaultApps();
  }

  private async initializeDefaultApps() {
    const existingApps = await db.select().from(apps);
    if (existingApps.length === 0) {
      const defaultApps = [
        {
          name: "LinkBoard",
          description: "Build your link-in-bio profile without revealing personal information. Share your content while maintaining privacy.",
          url: "#",
          icon: "link",
          gradient: "from-blue-500 to-blue-600",
          category: "social"
        },
        {
          name: "NoteVault",
          description: "Write and protect your private notes with end-to-end encryption. No email tracking or data mining.",
          url: "#",
          icon: "file-text",
          gradient: "from-emerald-500 to-emerald-600",
          category: "productivity"
        },
        {
          name: "TaskFlow",
          description: "Organize tasks and projects without surveillance. Privacy-focused productivity at its finest.",
          url: "#",
          icon: "clipboard-check",
          gradient: "from-purple-500 to-purple-600",
          category: "productivity"
        },
        {
          name: "ForumLite",
          description: "Create community spaces without forced personal information. Anonymous discussions, authentic connections.",
          url: "#",
          icon: "message-square",
          gradient: "from-orange-500 to-orange-600",
          category: "social"
        }
      ];

      await db.insert(apps).values(defaultApps);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser & { recoveryKeyHash: string; encryptionKey: string; kdfSalt: string }): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }


  async updateUserPassword(id: string, password: string): Promise<boolean> {
    const result = await db
      .update(users)
      .set({ password })
      .where(eq(users.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async updateUserLastLogin(id: string): Promise<boolean> {
    const result = await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // User app credentials methods
  async getUserAppCredentials(userId: string): Promise<UserAppCredential[]> {
    return await db
      .select()
      .from(userAppCredentials)
      .where(eq(userAppCredentials.userId, userId))
      .orderBy(userAppCredentials.createdAt);
  }

  async getUserAppCredential(userId: string, appId: number): Promise<UserAppCredential | undefined> {
    const [credential] = await db
      .select()
      .from(userAppCredentials)
      .where(and(
        eq(userAppCredentials.userId, userId),
        eq(userAppCredentials.appId, appId)
      ));
    return credential || undefined;
  }

  async createUserAppCredential(credential: InsertUserAppCredential & { userId: string }): Promise<UserAppCredential> {
    const [newCredential] = await db
      .insert(userAppCredentials)
      .values(credential)
      .returning();
    return newCredential;
  }

  async updateUserAppCredential(id: number, credentialData: Partial<InsertUserAppCredential>): Promise<UserAppCredential | undefined> {
    const updateData = { ...credentialData, updatedAt: new Date() };
    const [updatedCredential] = await db
      .update(userAppCredentials)
      .set(updateData)
      .where(eq(userAppCredentials.id, id))
      .returning();
    return updatedCredential || undefined;
  }

  async deleteUserAppCredential(id: number): Promise<boolean> {
    const result = await db.delete(userAppCredentials).where(eq(userAppCredentials.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getAllApps(): Promise<App[]> {
    return await db.select().from(apps).where(eq(apps.isActive, true)).orderBy(apps.id);
  }

  async getApp(id: number): Promise<App | undefined> {
    const [app] = await db.select().from(apps).where(eq(apps.id, id));
    return app || undefined;
  }

  async createApp(app: InsertApp): Promise<App> {
    const [newApp] = await db.insert(apps).values({
      ...app,
      icon: app.icon || "link",
      gradient: app.gradient || "from-blue-500 to-blue-600",
      category: app.category || "productivity"
    }).returning();
    return newApp;
  }

  async updateApp(id: number, appData: Partial<InsertApp>): Promise<App | undefined> {
    const [updatedApp] = await db
      .update(apps)
      .set(appData)
      .where(eq(apps.id, id))
      .returning();
    return updatedApp || undefined;
  }

  async deleteApp(id: number): Promise<boolean> {
    const result = await db.delete(apps).where(eq(apps.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async recordAppVisit(appId: number): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const [existingStat] = await db
      .select()
      .from(appStats)
      .where(and(
        eq(appStats.appId, appId),
        sql`DATE(${appStats.date}) = ${today}`
      ));

    if (existingStat) {
      await db
        .update(appStats)
        .set({ visits: existingStat.visits + 1 })
        .where(eq(appStats.id, existingStat.id));
    } else {
      await db.insert(appStats).values({
        appId,
        visits: 1,
      });
    }
  }

  async getAppStats(appId: number): Promise<AppStats[]> {
    return await db
      .select()
      .from(appStats)
      .where(eq(appStats.appId, appId))
      .orderBy(desc(appStats.date));
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.publishedAt));
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values({
      ...post,
      publishedAt: post.published ? new Date() : null,
    }).returning();
    return newPost;
  }

  async updateBlogPost(id: number, postData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const updateData: any = { ...postData, updatedAt: new Date() };
    if (postData.published) {
      updateData.publishedAt = new Date();
    }
    
    const [updatedPost] = await db
      .update(blogPosts)
      .set(updateData)
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost || undefined;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();
