import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const keywordSchema = z.object({
  id: z.string(),
  text: z.string().min(1),
  category: z.string().optional(),
});

export type Keyword = z.infer<typeof keywordSchema>;

export const competitorSchema = z.object({
  id: z.string(),
  url: z.string().url("Please enter a valid URL"),
});

export type Competitor = z.infer<typeof competitorSchema>;

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  websiteUrl: text("website_url").notNull(),
  country: text("country").notNull(),
  timezone: text("timezone").notNull(),
  keywords: jsonb("keywords").$type<Keyword[]>().notNull().default([]),
  competitors: jsonb("competitors").$type<Competitor[]>().notNull().default([]),
  status: text("status").notNull().default("draft"),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export const projectFormSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  websiteUrl: z.string().url("Please enter a valid URL"),
  country: z.string().min(1, "Country is required"),
  timezone: z.string().min(1, "Timezone is required"),
  keywords: z.array(keywordSchema).default([]),
  competitors: z.array(competitorSchema).default([]),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;

export const countries = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "NL", name: "Netherlands" },
  { code: "BR", name: "Brazil" },
  { code: "IN", name: "India" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "KR", name: "South Korea" },
  { code: "SG", name: "Singapore" },
];

export const timezones = [
  { value: "America/New_York", label: "Eastern Time (US & Canada)" },
  { value: "America/Chicago", label: "Central Time (US & Canada)" },
  { value: "America/Denver", label: "Mountain Time (US & Canada)" },
  { value: "America/Los_Angeles", label: "Pacific Time (US & Canada)" },
  { value: "Europe/London", label: "London" },
  { value: "Europe/Paris", label: "Paris" },
  { value: "Europe/Berlin", label: "Berlin" },
  { value: "Asia/Tokyo", label: "Tokyo" },
  { value: "Asia/Shanghai", label: "Shanghai" },
  { value: "Asia/Singapore", label: "Singapore" },
  { value: "Australia/Sydney", label: "Sydney" },
];
