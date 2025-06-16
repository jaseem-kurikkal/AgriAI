import { users, predictions, chatMessages } from "@shared/schema";
import type { User, InsertUser, Prediction, ChatMessage } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createPrediction(prediction: Omit<Prediction, "id" | "createdAt">): Promise<Prediction>;
  getUserPredictions(userId: number): Promise<Prediction[]>;
  createChatMessage(message: Omit<ChatMessage, "id" | "createdAt">): Promise<ChatMessage>;
  getUserChatHistory(userId: number): Promise<ChatMessage[]>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private predictions: Map<number, Prediction>;
  private chatMessages: Map<number, ChatMessage>;
  sessionStore: session.Store;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.predictions = new Map();
    this.chatMessages = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
      stale: false,
    });
    
    // Create a test user for development
    const testUser = {
      id: this.currentId++,
      username: "test",
      password: "test",
      fullName: "Test User",
      role: "farmer" as const,
    };
    this.users.set(testUser.id, testUser);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user = { ...insertUser, id, role: "farmer" };
    this.users.set(id, user);
    return user;
  }

  async createPrediction(prediction: Omit<Prediction, "id" | "createdAt">): Promise<Prediction> {
    const id = this.currentId++;
    const newPrediction = {
      ...prediction,
      id,
      createdAt: new Date(),
    };
    this.predictions.set(id, newPrediction);
    return newPrediction;
  }

  async getUserPredictions(userId: number): Promise<Prediction[]> {
    return Array.from(this.predictions.values()).filter(
      (pred) => pred.userId === userId,
    );
  }

  async createChatMessage(message: Omit<ChatMessage, "id" | "createdAt">): Promise<ChatMessage> {
    const id = this.currentId++;
    const newMessage = {
      ...message,
      id,
      createdAt: new Date(),
    };
    this.chatMessages.set(id, newMessage);
    return newMessage;
  }

  async getUserChatHistory(userId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter((msg) => msg.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const storage = new MemStorage();
