import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy-initialize Gemini SDK dynamically to prevent startup failure if GEMINI_API_KEY is not defined
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  // API Route: Analyze market sentiments using Gemini server-side
  app.post("/api/analyze-market", async (req, res) => {
    try {
      const { news } = req.body;
      if (!news || !Array.isArray(news)) {
        return res.status(400).json({ error: "Invalid news payload" });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({ 
          error: "Gemini client is uninitialized on server because GEMINI_API_KEY is not set." 
        });
      }

      const prompt = `You are an expert cryptocurrency market sentiment intelligence bot.
Analyze these latest crypto headlines/summaries and return a JSON object with strictly these keys:
- "marketSummaryText": A highly professional, 2-3 sentence overall mood summary of the crypto market right now. Focus on liquidity, momentum, and institutional activity.
- "topBullishSignal": A 1-sentence description of the prime bullish opportunity seen in this news.
- "topBearishWarning": A 1-sentence description of the biggest risk factors or bearish warning signs.
- "aiTradingSuggestion": Professional advice for a crypto trader today (e.g. cautious range-bound, aggressive accumulation on support, protective capital conservation).
- "sentimentTrend": Whether the overall sentiment is getting more bullish, consolidating, or declining compared to previous sessions.

Here is the news data:
${JSON.stringify(news)}

Return only a valid, pure JSON object. Keep it clean and concise. Do not wrap in markdown or backticks.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text || "{}";
      const parsedData = JSON.parse(responseText.trim());
      res.json(parsedData);
    } catch (err: any) {
      console.error("Gemini server-side analysis error:", err);
      res.status(500).json({ error: "Failed to generate AI analysis", details: err?.message });
    }
  });

  // Vite middleware for development vs static build router for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
