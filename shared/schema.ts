import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  recoveryKeyHash: text("recovery_key_hash").notNull(), // Hashed recovery key
  encryptionKey: text("encryption_key").notNull(), // User encryption key (encrypted)
  kdfSalt: text("kdf_salt").notNull(), // Salt for key derivation
  email: text("email"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  lastLoginAt: timestamp("last_login_at"),
});

export const apps = pgTable("apps", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  icon: text("icon").notNull().default("link"),
  gradient: text("gradient").notNull().default("from-blue-500 to-blue-600"),
  category: text("category").notNull().default("productivity"),
  isActive: boolean("is_active").notNull().default(true),
  statusUrl: text("status_url"),
  lastChecked: timestamp("last_checked"),
  isOnline: boolean("is_online").default(true),
  // Nouveaux champs pour les détails de l'app
  longDescription: text("long_description"),
  specifications: text("specifications"), // JSON string pour stocker les specs
  features: text("features"), // JSON string pour stocker les fonctionnalités
  images: text("images"), // JSON string pour stocker les URLs d'images
  version: text("version"),
  lastUpdated: timestamp("last_updated"),
  developer: text("developer"),
  supportEmail: text("support_email"),
  privacyPolicy: text("privacy_policy"),
  termsOfService: text("terms_of_service"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Table pour stocker les credentials des apps que chaque utilisateur gère
export const userAppCredentials = pgTable("user_app_credentials", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  appId: integer("app_id").notNull().references(() => apps.id, { onDelete: "cascade" }),
  appUsername: text("app_username").notNull(),
  appPassword: text("app_password").notNull(), // Chiffré
  appRecoveryKey: text("app_recovery_key"), // Clé de récupération de l'app
  isActive: boolean("is_active").notNull().default(true),
  notes: text("notes"), // Notes personnelles de l'utilisateur
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const appStats = pgTable("app_stats", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  appId: integer("app_id").notNull().references(() => apps.id, { onDelete: "cascade" }),
  visits: integer("visits").notNull().default(0),
  date: timestamp("date").notNull().default(sql`now()`),
});

export const blogPosts = pgTable("blog_posts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  slug: text("slug").notNull().unique(),
  published: boolean("published").notNull().default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const usersRelations = relations(users, ({ many }) => ({
  appCredentials: many(userAppCredentials),
}));

export const userAppCredentialsRelations = relations(userAppCredentials, ({ one }) => ({
  user: one(users, {
    fields: [userAppCredentials.userId],
    references: [users.id],
  }),
  app: one(apps, {
    fields: [userAppCredentials.appId],
    references: [apps.id],
  }),
}));

export const appsRelations = relations(apps, ({ many }) => ({
  stats: many(appStats),
  userCredentials: many(userAppCredentials),
}));

export const appStatsRelations = relations(appStats, ({ one }) => ({
  app: one(apps, {
    fields: [appStats.appId],
    references: [apps.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const insertUserAppCredentialSchema = createInsertSchema(userAppCredentials).pick({
  appId: true,
  appUsername: true,
  appPassword: true,
  appRecoveryKey: true,
  notes: true,
});

export const insertAppSchema = createInsertSchema(apps).pick({
  name: true,
  description: true,
  url: true,
  icon: true,
  gradient: true,
  category: true,
  statusUrl: true,
  longDescription: true,
  specifications: true,
  features: true,
  images: true,
  version: true,
  developer: true,
  supportEmail: true,
  privacyPolicy: true,
  termsOfService: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  content: true,
  excerpt: true,
  slug: true,
  published: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertUserAppCredential = z.infer<typeof insertUserAppCredentialSchema>;
export type UserAppCredential = typeof userAppCredentials.$inferSelect;
export type InsertApp = z.infer<typeof insertAppSchema>;
export type App = typeof apps.$inferSelect;
export type AppStats = typeof appStats.$inferSelect;
export type InsertAppStats = typeof appStats.$inferInsert;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
