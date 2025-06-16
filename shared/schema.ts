import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  role: text("role").default("farmer"),
});

export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // plant-disease, seed, seasonal-crop
  input: json("input").notNull(),
  result: json("result").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  message: text("message").notNull(),
  response: text("response").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users)
  .pick({
    username: true,
    password: true,
    fullName: true,
    email: true,
    phone: true,
  })
  .extend({
    email: z.string().email("Please enter a valid email address").refine(
      (email) => email.toLowerCase().endsWith("@gmail.com"),
      "Please use a Gmail address"
    ),
    phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number is too long")
  });

export const insertPredictionSchema = createInsertSchema(predictions).pick({
  type: true,
  input: true,
  result: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  message: true,
  response: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Prediction = typeof predictions.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
