import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage as fileStorage } from "./storage";
import { insertPredictionSchema, insertChatMessageSchema } from "@shared/schema";

import multer from 'multer';
import axios from 'axios';

// Configure storage for uploaded files
const storage = multer.memoryStorage();
const upload = multer({ storage });



export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Image Analysis Endpoints
  app.post('/api/analyze/health', upload.single('image'), async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (!req.file) return res.status(400).json({ error: 'No image provided' });

    try {
      // For demo purposes, generate a random health score
      const healthScore = 70 + Math.random() * 30;

      // Mock recommendations based on health score
      let recommendations = [];
      if (healthScore > 90) {
        recommendations = [
          "Crop health is excellent",
          "Continue current maintenance practices",
          "Monitor for any changes in leaf color"
        ];
      } else if (healthScore > 70) {
        recommendations = [
          "Crop health is good but could be improved",
          "Consider increasing watering frequency",
          "Check for signs of nutrient deficiency"
        ];
      } else {
        recommendations = [
          "Crop health needs attention",
          "Inspect for pest infestations",
          "Consider soil nutrient analysis"
        ];
      }

      res.json({
        health_score: parseFloat(healthScore.toFixed(1)),
        recommendations
      });


    } catch (error) {
      console.error('Analysis error:', error);
      res.status(500).json({ error: 'Analysis failed' });
    }
  });

  app.post('/api/analyze/soil', upload.single('image'), async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (!req.file) return res.status(400).json({ error: 'No image provided' });

    try {
      // Process soil image and return analysis
      // This is a mock response - implement actual analysis
      res.json({
        nutrient_levels: {
          nitrogen: 45,
          phosphorus: 32,
          potassium: 28
        },
        ph: 6.5,
        organic_matter: 3.2,
        recommendations: [
          "Consider adding nitrogen-rich fertilizers",
          "Soil pH is optimal for most crops",
          "Increase organic matter through mulching"
        ]
      });
    } catch (error) {
      console.error('Soil analysis error:', error);
      res.status(500).json({ error: 'Analysis failed' });
    }
  });

  // News endpoint
  app.get("/api/news", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const category = req.query.category as string;
    const mockNews = [
      {
        id: 1,
        title: "AI Revolutionizes Crop Disease Detection",
        excerpt: "New AI models achieve 95% accuracy in identifying plant diseases from photos.",
        date: "2025-04-01",
        category: "AI in Agriculture",
        url: "https://example.com/ai-crop-disease"
      },
      {
        id: 2,
        title: "Sustainable Farming Practices Boost Yields",
        excerpt: "Farmers report 30% increase in yields using organic methods.",
        date: "2025-04-02",
        category: "Sustainable Practices",
        url: "https://example.com/sustainable-farming"
      },
      {
        id: 3,
        title: "Global Market Trends in Agriculture 2025",
        excerpt: "Analysis of emerging agricultural markets and opportunities.",
        date: "2025-04-03",
        category: "Market Trends",
        url: "https://example.com/market-trends"
      },
      {
        id: 4,
        title: "Organic Certification Guidelines Updated",
        excerpt: "New standards for organic farming certification announced.",
        date: "2025-04-04",
        category: "Organic Farming",
        url: "https://example.com/organic-guidelines"
      }
    ];

    const articles = category === "All" 
      ? mockNews
      : mockNews.filter(article => article.category === category);

    res.json({ articles });
  });

  // Seed Recommendation endpoint
  app.post("/api/seed-recommendation", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.sendStatus(401);
      }

      const { soilPh, temperature, rainfall, region, soilType, irrigationAvailable, farmingExperience } = req.body;
      const ph = parseFloat(soilPh);
      const temp = parseFloat(temperature);
      const rain = parseFloat(rainfall);

      // Crop database with detailed requirements
      const crops = [
        {
          crop: "Rice",
          varieties: [
            { name: "IR-36", type: "Short duration", yield: "5-6 tons/ha", conditions: { rainfall: "high", temp: "high" } },
            { name: "BPT-5204", type: "Medium duration", yield: "6-7 tons/ha", conditions: { rainfall: "medium", temp: "medium" } },
            { name: "MTU-7029", type: "Long duration", yield: "7-8 tons/ha", conditions: { rainfall: "very high", temp: "high" } }
          ],
          phRange: [5.0, 7.5],
          tempRange: [20, 35],
          rainfallRange: [1000, 2500],
          regions: ["Kerala", "Tamil Nadu", "Karnataka", "Andhra Pradesh", "West Bengal", "Bihar"],
          season: "Kharif"
        },
        {
          crop: "Wheat",
          varieties: [
            { name: "HD-2967", type: "Timely sown", yield: "5-5.5 tons/ha", conditions: { rainfall: "medium", temp: "low" } },
            { name: "DBW-187", type: "Late sown", yield: "4.5-5 tons/ha", conditions: { rainfall: "low", temp: "medium" } },
            { name: "HD-3086", type: "Heat tolerant", yield: "5.5-6 tons/ha", conditions: { rainfall: "medium", temp: "high" } }
          ],
          phRange: [6.0, 7.5],
          tempRange: [15, 25],
          rainfallRange: [600, 1100],
          regions: ["Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh", "Rajasthan"],
          season: "Rabi"
        },
        {
          crop: "Maize",
          varieties: [
            { name: "DHM-117", type: "Hybrid", yield: "8-9 tons/ha", conditions: { rainfall: "medium", temp: "medium" } },
            { name: "PMH-1", type: "Single cross hybrid", yield: "7-8 tons/ha", conditions: { rainfall: "high", temp: "high" } },
            { name: "VMH-45", type: "Heat tolerant", yield: "6-7 tons/ha", conditions: { rainfall: "low", temp: "high" } }
          ],
          phRange: [5.5, 7.5],
          tempRange: [20, 30],
          rainfallRange: [500, 1200],
          regions: ["Karnataka", "Andhra Pradesh", "Bihar", "Maharashtra", "Tamil Nadu"],
          season: "Kharif/Rabi"
        },
        {
          crop: "Cotton",
          varieties: [
            { name: "Suraj", type: "Medium staple", yield: "25-30 quintals/ha", conditions: { rainfall: "medium", temp: "high" } },
            { name: "Brahma", type: "Long staple", yield: "30-35 quintals/ha", conditions: { rainfall: "high", temp: "high" } },
            { name: "DCH-32", type: "Hybrid", yield: "35-40 quintals/ha", conditions: { rainfall: "medium", temp: "very high" } }
          ],
          phRange: [6.0, 8.0],
          tempRange: [21, 35],
          rainfallRange: [500, 1000],
          regions: ["Gujarat", "Maharashtra", "Telangana", "Punjab", "Haryana"],
          season: "Kharif"
        },
        {
          crop: "Groundnut",
          varieties: [
            { name: "TMV-2", type: "High yielding", yield: "2.5-3 tons/ha", conditions: { rainfall: "medium", temp: "high" } },
            { name: "TAG-24", type: "Early maturing", yield: "2-2.5 tons/ha", conditions: { rainfall: "low", temp: "medium" } },
            { name: "GG-20", type: "Disease resistant", yield: "2.8-3.2 tons/ha", conditions: { rainfall: "high", temp: "high" } }
          ],
          phRange: [6.0, 7.5],
          tempRange: [25, 35],
          rainfallRange: [500, 1200],
          regions: ["Gujarat", "Andhra Pradesh", "Tamil Nadu", "Karnataka", "Maharashtra"],
          season: "Kharif"
        },
        {
          crop: "Soybean",
          varieties: [
            { name: "JS-335", type: "High yielding", yield: "2.5-3 tons/ha", conditions: { rainfall: "medium", temp: "medium" } },
            { name: "NRC-37", type: "Disease resistant", yield: "2-2.5 tons/ha", conditions: { rainfall: "high", temp: "medium" } },
            { name: "MACS-58", type: "Early maturing", yield: "2.2-2.8 tons/ha", conditions: { rainfall: "low", temp: "high" } }
          ],
          phRange: [6.0, 7.5],
          tempRange: [20, 30],
          rainfallRange: [600, 1000],
          regions: ["Madhya Pradesh", "Maharashtra", "Rajasthan", "Karnataka"],
          season: "Kharif"
        },
        {
          crop: "Tomato",
          varieties: [
            { name: "Arka Vikas", type: "High yielding", yield: "25-30 tons/ha", conditions: { rainfall: "medium", temp: "medium" } },
            { name: "Pusa Ruby", type: "Disease resistant", yield: "20-25 tons/ha", conditions: { rainfall: "low", temp: "medium" } },
            { name: "NS-816", type: "Hybrid", yield: "30-35 tons/ha", conditions: { rainfall: "medium", temp: "high" } }
          ],
          phRange: [6.0, 7.0],
          tempRange: [20, 30],
          rainfallRange: [400, 800],
          regions: ["Karnataka", "Maharashtra", "Andhra Pradesh", "Tamil Nadu", "Gujarat"],
          season: "Year round"
        },
        {
          crop: "Chilli",
          varieties: [
            { name: "Pusa Jwala", type: "High yielding", yield: "2-2.5 tons/ha", conditions: { rainfall: "medium", temp: "high" } },
            { name: "G4", type: "Disease resistant", yield: "1.8-2.2 tons/ha", conditions: { rainfall: "low", temp: "very high" } },
            { name: "K2", type: "Hybrid", yield: "2.5-3 tons/ha", conditions: { rainfall: "medium", temp: "medium" } }
          ],
          phRange: [6.0, 7.0],
          tempRange: [20, 35],
          rainfallRange: [500, 1000],
          regions: ["Andhra Pradesh", "Karnataka", "Tamil Nadu", "Maharashtra"],
          season: "Kharif/Rabi"
        },
        {
          crop: "Onion",
          varieties: [
            { name: "Agrifound Light Red", type: "High yielding", yield: "25-30 tons/ha", conditions: { rainfall: "medium", temp: "medium" } },
            { name: "Bhima Super", type: "Disease resistant", yield: "30-35 tons/ha", conditions: { rainfall: "low", temp: "high" } },
            { name: "N-53", type: "Storage type", yield: "20-25 tons/ha", conditions: { rainfall: "medium", temp: "medium" } }
          ],
          phRange: [6.0, 7.0],
          tempRange: [15, 30],
          rainfallRange: [450, 800],
          regions: ["Maharashtra", "Karnataka", "Gujarat", "Madhya Pradesh"],
          season: "Rabi"
        },
        {
          crop: "Potato",
          varieties: [
            { name: "Kufri Jyoti", type: "High yielding", yield: "25-30 tons/ha", conditions: { rainfall: "medium", temp: "low" } },
            { name: "Kufri Chandramukhi", type: "Early maturing", yield: "20-25 tons/ha", conditions: { rainfall: "medium", temp: "medium" } },
            { name: "Kufri Sindhuri", type: "Disease resistant", yield: "22-28 tons/ha", conditions: { rainfall: "high", temp: "low" } }
          ],
          phRange: [5.5, 6.5],
          tempRange: [15, 25],
          rainfallRange: [500, 1000],
          regions: ["Uttar Pradesh", "West Bengal", "Punjab", "Bihar"],
          season: "Rabi"
        }
      ];

      // Calculate suitability scores
      const recommendations = crops.map(crop => {
        // Calculate individual scores
        const phScore = ph >= crop.phRange[0] && ph <= crop.phRange[1] ? 1 : 
          Math.max(0, 1 - Math.min(Math.abs(ph - crop.phRange[0]), Math.abs(ph - crop.phRange[1])) / 2);

        const tempScore = temp >= crop.tempRange[0] && temp <= crop.tempRange[1] ? 1 :
          Math.max(0, 1 - Math.min(Math.abs(temp - crop.tempRange[0]), Math.abs(temp - crop.tempRange[1])) / 10);

        const rainScore = rain >= crop.rainfallRange[0] && rain <= crop.rainfallRange[1] ? 1 :
          Math.max(0, 1 - Math.min(Math.abs(rain - crop.rainfallRange[0]), Math.abs(rain - crop.rainfallRange[1])) / 500);

        const regionScore = crop.regions.some(r => r.toLowerCase() === region.toLowerCase()) ? 1 : 0.5;

        // Calculate soil type compatibility
        const soilTypeScore = (() => {
          const soilTypeCompatibility: { [key: string]: { [key: string]: number } } = {
            'Rice': { 'Alluvial': 1, 'Clay': 0.9, 'Black': 0.7, 'Red': 0.6, 'Laterite': 0.5, 'Sandy': 0.4 },
            'Wheat': { 'Alluvial': 1, 'Black': 0.9, 'Red': 0.7, 'Clay': 0.8, 'Laterite': 0.5, 'Sandy': 0.6 },
            'Maize': { 'Alluvial': 1, 'Black': 0.9, 'Red': 0.8, 'Clay': 0.7, 'Sandy': 0.6, 'Laterite': 0.5 },
            'Cotton': { 'Black': 1, 'Alluvial': 0.9, 'Red': 0.8, 'Clay': 0.7, 'Laterite': 0.6, 'Sandy': 0.5 },
            'Pulses (Black Gram)': { 'Black': 1, 'Red': 0.9, 'Alluvial': 0.8, 'Clay': 0.7, 'Sandy': 0.6, 'Laterite': 0.5 },
            'Sugarcane': { 'Alluvial': 1, 'Black': 0.9, 'Red': 0.8, 'Clay': 0.8, 'Laterite': 0.6, 'Sandy': 0.5 }
          };
          return soilTypeCompatibility[crop.crop]?.[soilType] || 0.5;
        })();

        // Calculate irrigation requirement score
        const irrigationScore = (() => {
          if (irrigationAvailable === 'Full') return 1;
          if (irrigationAvailable === 'Partial') {
            // Crops that can manage with partial irrigation
            const partialIrrigationTolerant = ['Maize', 'Pulses (Black Gram)', 'Cotton'];
            return partialIrrigationTolerant.includes(crop.crop) ? 0.9 : 0.7;
          }
          // Rainfed only
          const rainfedTolerant = ['Pulses (Black Gram)', 'Maize'];
          return rainfedTolerant.includes(crop.crop) ? 0.8 : 0.5;
        })();

        // Experience factor
        const experienceScore = (() => {
          const cropComplexity: { [key: string]: number } = {
            'Rice': 0.7,
            'Wheat': 0.7,
            'Maize': 0.8,
            'Cotton': 0.6,
            'Pulses (Black Gram)': 0.9,
            'Sugarcane': 0.5
          };
          
          const baseComplexity = cropComplexity[crop.crop] || 0.7;
          
          switch (farmingExperience) {
            case 'Experienced': return 1;
            case 'Intermediate': return baseComplexity + 0.2;
            default: return baseComplexity; // Beginner
          }
        })();

        // Calculate overall confidence score with new factors
        const confidence = Math.round(
          (phScore * 0.15 + 
           tempScore * 0.15 + 
           rainScore * 0.15 + 
           regionScore * 0.15 + 
           soilTypeScore * 0.15 +
           irrigationScore * 0.15 +
           experienceScore * 0.1) * 100
        );

        // Select best variety based on conditions
        const variety = (() => {
          const getRainfallCategory = (rain: number) => {
            if (rain < 500) return 'low';
            if (rain < 1000) return 'medium';
            if (rain < 1500) return 'high';
            return 'very high';
          };

          const getTemperatureCategory = (temp: number) => {
            if (temp < 20) return 'low';
            if (temp < 25) return 'medium';
            if (temp < 30) return 'high';
            return 'very high';
          };

          const currentConditions = {
            rainfall: getRainfallCategory(rain),
            temp: getTemperatureCategory(temp)
          };

          return crop.varieties.reduce((best, current) => {
            const matchScore = Object.entries(current.conditions).reduce((score, [key, value]) => {
              return score + (value === currentConditions[key as keyof typeof currentConditions] ? 1 : 0);
            }, 0);
            return matchScore > best.score ? { variety: current, score: matchScore } : best;
          }, { variety: crop.varieties[0], score: -1 }).variety;
        })(); // You can enhance this selection based on specific conditions

        return {
          crop: crop.crop,
          variety: variety.name,
          confidence,
          details: `${variety.type} variety with yield potential of ${variety.yield}. Best suited for ${crop.season} season.
${confidence > 80 ? 'Highly recommended for your conditions!' : confidence > 60 ? 'Suitable with proper management.' : 'May require additional care and management.'}
Soil Compatibility: ${Math.round(soilTypeScore * 100)}%
Irrigation Needs: ${irrigationAvailable === 'Full' ? 'Optimal' : irrigationAvailable === 'Partial' ? 'Manageable' : 'Challenging'}
Complexity Level: ${farmingExperience === 'Experienced' ? 'Well within your expertise' : farmingExperience === 'Intermediate' ? 'Suitable for your experience' : 'May require guidance'}`
        };
      }).sort((a, b) => b.confidence - a.confidence);

      // Return top recommendations
      res.json({ recommendations: recommendations.slice(0, 5) });
    } catch (error) {
      console.error("Seed recommendation error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Analytics Endpoints
  app.get('/api/fields', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      // Mock data - replace with actual database queries
      const fields = [{
        id: "field1",
        name: "North Field",
        health_history: Array.from({ length: 10 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          score: 75 + Math.random() * 10
        })),
        yield_history: Array.from({ length: 10 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          actual: 80 + Math.random() * 10,
          predicted: 85 + Math.random() * 5
        })),
        nutrient_history: Array.from({ length: 10 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1).toISOString().split('T')[0],
          nitrogen: 40 + Math.random() * 10,
          phosphorus: 30 + Math.random() * 10,
          potassium: 25 + Math.random() * 10
        }))
      }];

      res.json(fields);
    } catch (error) {
      console.error('Error fetching field data:', error);
      res.status(500).json({ error: 'Failed to fetch field data' });
    }
  });

  // Weather API integration
  app.get('/api/weather/:lat/:lon', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const { lat, lon } = req.params;
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
      );
      res.json(response.data);
    } catch (error) {
      console.error('Weather API error:', error);
      res.status(500).json({ error: 'Failed to fetch weather data' });
    }
  });


  // Chat endpoint for AI farming assistant
  app.post("/api/chat", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    try {
      // Here you would typically call your AI model or service
      // For now, we'll return mock responses based on keywords
      let response = "I'm sorry, I don't have specific information about that. Please ask about crops, soil, pests, or farming practices.";
      
      const msg = message.toLowerCase();
      if (msg.includes("crop") || msg.includes("plant")) {
        response = "For optimal crop growth, ensure proper spacing, regular watering, and monitor for signs of disease. Different crops have different needs - which crop are you interested in?";
      } else if (msg.includes("soil")) {
        response = "Good soil health is crucial for farming. Consider testing your soil pH, maintaining organic matter content, and practicing crop rotation to preserve soil fertility.";
      } else if (msg.includes("pest")) {
        response = "Integrated Pest Management (IPM) is recommended. This includes regular monitoring, using beneficial insects, and only using pesticides as a last resort.";
      } else if (msg.includes("water") || msg.includes("irrigation")) {
        response = "Efficient water management is key. Consider drip irrigation, mulching to retain moisture, and watering early morning or late evening to minimize evaporation.";
      }
      else if (msg.includes("hi") || msg.includes("hello")) {
        response = "hi, how can i help you.";
      }

      res.json({ response });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process message" });
    }
  });


  // News endpoint
  app.get("/api/news", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const category = req.query.category as string;
    const mockNews = [
      {
        id: 1,
        title: "AI Revolutionizes Crop Disease Detection",
        excerpt: "New AI models achieve 95% accuracy in identifying plant diseases from photos.",
        date: "2025-04-01",
        category: "AI in Agriculture",
        url: "https://example.com/ai-crop-disease"
      },
      {
        id: 2,
        title: "Sustainable Farming Practices Boost Yields",
        excerpt: "Farmers report 30% increase in yields using organic methods.",
        date: "2025-04-02",
        category: "Sustainable Practices",
        url: "https://example.com/sustainable-farming"
      },
      {
        id: 3,
        title: "Global Market Trends in Agriculture 2025",
        excerpt: "Analysis of emerging agricultural markets and opportunities.",
        date: "2025-04-03",
        category: "Market Trends",
        url: "https://example.com/market-trends"
      },
      {
        id: 4,
        title: "Organic Certification Guidelines Updated",
        excerpt: "New standards for organic farming certification announced.",
        date: "2025-04-04",
        category: "Organic Farming",
        url: "https://example.com/organic-guidelines"
      },
      {
        id: 5,
        title: "Smart Irrigation Systems Save Water",
        excerpt: "AI-powered irrigation reduces water usage by 40%.",
        date: "2025-04-05",
        category: "AI in Agriculture",
        url: "https://example.com/smart-irrigation"
      }
    ];

    const filteredNews = category === "All" 
      ? mockNews 
      : mockNews.filter(article => article.category === category);

    res.json({ articles: filteredNews });
  });


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

  // Add this function above the route handlers
  function getSeedRecommendations(conditions: {
    soilPh: number,
    temperature: number,
    rainfall: number,
    region: string
  }) {
    // Comprehensive seed database with accurate growing requirements
    const seedDatabase = [
      {
        seed: "Rice",
        requirements: {
          phRange: [5.5, 6.5],
          tempRange: [21, 37],
          minRainfall: 1000,
          regions: ["tropical", "subtropical"],
          description: "Staple crop that thrives in warm, humid conditions with high rainfall"
        }
      },
      {
        seed: "Wheat",
        requirements: {
          phRange: [6.0, 7.0],
          tempRange: [15, 24],
          minRainfall: 500,
          regions: ["temperate", "mediterranean", "subtropical"],
          description: "Cool-season grain crop suitable for moderate temperatures"
        }
      },
      {
        seed: "Corn (Maize)",
        requirements: {
          phRange: [5.8, 7.0],
          tempRange: [20, 30],
          minRainfall: 600,
          regions: ["temperate", "tropical", "subtropical"],
          description: "Versatile crop that requires warm temperatures and moderate rainfall"
        }
      },
      {
        seed: "Soybeans",
        requirements: {
          phRange: [6.0, 6.8],
          tempRange: [20, 30],
          minRainfall: 700,
          regions: ["temperate", "subtropical"],
          description: "Legume crop that fixes nitrogen in soil"
        }
      },
      {
        seed: "Cotton",
        requirements: {
          phRange: [5.8, 7.0],
          tempRange: [21, 35],
          minRainfall: 500,
          regions: ["tropical", "subtropical"],
          description: "Warm-season crop that requires long frost-free periods"
        }
      },
      {
        seed: "Tomatoes",
        requirements: {
          phRange: [6.0, 6.8],
          tempRange: [20, 27],
          minRainfall: 400,
          regions: ["temperate", "mediterranean", "subtropical"],
          description: "Warm-season fruit crop that needs well-drained soil"
        }
      },
      {
        seed: "Potatoes",
        requirements: {
          phRange: [5.0, 6.5],
          tempRange: [15, 23],
          minRainfall: 500,
          regions: ["temperate", "subtropical"],
          description: "Cool-season tuber crop that prefers slightly acidic soil"
        }
      },
      {
        seed: "Sugarcane",
        requirements: {
          phRange: [6.0, 7.5],
          tempRange: [20, 35],
          minRainfall: 1500,
          regions: ["tropical", "subtropical"],
          description: "Tropical grass that requires high rainfall and temperatures"
        }
      },
      {
        seed: "Sorghum",
        requirements: {
          phRange: [5.5, 7.5],
          tempRange: [20, 35],
          minRainfall: 450,
          regions: ["tropical", "subtropical", "temperate"],
          description: "Drought-tolerant grain crop suitable for hot climates"
        }
      },
      {
        seed: "Peanuts",
        requirements: {
          phRange: [5.9, 7.0],
          tempRange: [20, 34],
          minRainfall: 500,
          regions: ["tropical", "subtropical"],
          description: "Legume that requires well-drained sandy soil"
        }
      },
      {
        seed: "Cassava",
        requirements: {
          phRange: [5.5, 6.5],
          tempRange: [20, 35],
          minRainfall: 750,
          regions: ["tropical"],
          description: "Tropical root crop tolerant to drought and poor soils"
        }
      },
      {
        seed: "Chickpeas",
        requirements: {
          phRange: [6.0, 8.0],
          tempRange: [15, 29],
          minRainfall: 400,
          regions: ["mediterranean", "temperate", "subtropical"],
          description: "Cool-season legume that tolerates dry conditions"
        }
      },
      {
        seed: "Sunflower",
        requirements: {
          phRange: [6.0, 7.5],
          tempRange: [18, 35],
          minRainfall: 500,
          regions: ["temperate", "subtropical"],
          description: "Drought-tolerant oilseed crop"
        }
      },
      {
        seed: "Barley",
        requirements: {
          phRange: [6.0, 7.0],
          tempRange: [12, 25],
          minRainfall: 450,
          regions: ["temperate", "mediterranean"],
          description: "Hardy grain crop suitable for cooler climates"
        }
      },
      {
        seed: "Millet",
        requirements: {
          phRange: [5.5, 7.0],
          tempRange: [20, 35],
          minRainfall: 400,
          regions: ["tropical", "subtropical"],
          description: "Drought-resistant grain crop for hot climates"
        }
      }
    ];

    // Calculate confidence scores for each seed with improved accuracy
    const recommendations = seedDatabase.map(seed => {
      // pH score (0-1) with more precise scaling
      const phScore = conditions.soilPh >= seed.requirements.phRange[0] && 
                     conditions.soilPh <= seed.requirements.phRange[1] ? 1.0 :
                     Math.max(0, 1 - Math.min(
                       Math.abs(conditions.soilPh - seed.requirements.phRange[0]),
                       Math.abs(conditions.soilPh - seed.requirements.phRange[1])
                     ) / 1.5); // More gradual dropoff for pH differences
      
      // Temperature score (0-1) with optimal range consideration
      const tempMidpoint = (seed.requirements.tempRange[0] + seed.requirements.tempRange[1]) / 2;
      const tempRange = seed.requirements.tempRange[1] - seed.requirements.tempRange[0];
      const tempScore = conditions.temperature >= seed.requirements.tempRange[0] && 
                       conditions.temperature <= seed.requirements.tempRange[1] ? 
                       1.0 - 0.5 * Math.abs(conditions.temperature - tempMidpoint) / (tempRange / 2) :
                       Math.max(0, 1 - Math.min(
                         Math.abs(conditions.temperature - seed.requirements.tempRange[0]),
                         Math.abs(conditions.temperature - seed.requirements.tempRange[1])
                       ) / 8);
      
      // Rainfall score (0-1) with diminishing returns for excess
      const rainfallScore = conditions.rainfall >= seed.requirements.minRainfall ?
                           1.0 - Math.max(0, (conditions.rainfall - seed.requirements.minRainfall * 2) / (seed.requirements.minRainfall * 4)) :
                           Math.max(0, conditions.rainfall / seed.requirements.minRainfall);
      
      // Region score (0-1) with climate zone matching
      const regionScore = seed.requirements.regions
        .some(r => r.toLowerCase() === conditions.region.toLowerCase()) ? 1.0 : 0.2;
      
      // Calculate final confidence with weighted factors
      const confidence = (
        phScore * 0.25 +        // Soil pH is crucial for nutrient availability
        tempScore * 0.30 +      // Temperature is most critical for growth
        rainfallScore * 0.25 +  // Water availability is essential
        regionScore * 0.20      // Regional suitability accounts for other factors
      );
      
      return {
        seed: seed.seed,
        confidence,
        description: seed.description,
        requirements: {
          phRange: seed.requirements.phRange,
          tempRange: seed.requirements.tempRange,
          minRainfall: seed.requirements.minRainfall
        }
      };
    });

    // Sort by confidence and filter out poor matches
    return recommendations
      .sort((a, b) => b.confidence - a.confidence)
      .filter(rec => rec.confidence > 0.4); // Only return recommendations with >40% confidence
  }

  app.post("/api/predict/seed", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const { soilPh, temperature, rainfall, region } = req.body;

    // Convert string inputs to numbers
    const conditions = {
      soilPh: parseFloat(soilPh),
      temperature: parseFloat(temperature),
      rainfall: parseFloat(rainfall),
      region: region
    };

    const recommendations = getSeedRecommendations(conditions);

    const prediction = await storage.createPrediction({
      userId: req.user.id,
      type: "seed",
      input: req.body,
      result: { recommendations }
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
