import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertPredictionSchema, insertChatMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Mock prediction endpoints
  app.post("/api/predict/plant-disease", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const prediction = await storage.createPrediction({
      userId: req.user.id,
      type: "plant-disease",
      input: req.body,
      result: {
        disease: "Leaf Blight",
        confidence: 0.85,
        recommendations: [
          "Apply fungicide",
          "Improve air circulation",
          "Remove infected leaves"
        ]
      }
    });
    res.json(prediction);
  });

  app.post("/api/predict/seed", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const prediction = await storage.createPrediction({
      userId: req.user.id,
      type: "seed",
      input: req.body,
      result: {
        recommendations: [
          { seed: "Wheat", confidence: 0.9 },
          { seed: "Barley", confidence: 0.8 },
          { seed: "Oats", confidence: 0.7 }
        ]
      }
    });
    res.json(prediction);
  });

  app.post("/api/predict/season-crop", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const prediction = await storage.createPrediction({
      userId: req.user.id,
      type: "seasonal-crop",
      input: req.body,
      result: {
        crops: [
          { name: "Tomatoes", confidence: 0.95 },
          { name: "Peppers", confidence: 0.85 },
          { name: "Cucumbers", confidence: 0.75 }
        ],
        season: "Summer"
      }
    });
    res.json(prediction);
  });

  app.get("/api/predictions", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const predictions = await storage.getUserPredictions(req.user.id);
    res.json(predictions);
  });

  app.post("/api/chatbot", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const message = await storage.createChatMessage({
      userId: req.user.id,
      message: req.body.message,
      response: "This is a mock response from the agricultural AI assistant. In the future, this will be replaced with real LLM responses."
    });
    res.json(message);
  });

  app.get("/api/chatbot/history", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const history = await storage.getUserChatHistory(req.user.id);
    res.json(history);
  });

  const httpServer = createServer(app);
  return httpServer;
}
