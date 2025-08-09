import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { huggingFaceCV } from "./huggingface-computer-vision";
import { speechEmotionRecognition } from "./speech-emotion-recognition";
import { facialExpressionAnalysis } from "./facial-expression-analysis";

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Canonical host redirect to avoid cross-subdomain session issues
app.set('trust proxy', true);
app.use((req, res, next) => {
  const host = req.get('host') || '';
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd && host.startsWith('www.yappyy.com')) {
    const target = `https://yappyy.com${req.originalUrl || ''}`;
    return res.redirect(301, target);
  }
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Initialize Hugging Face AI Systems
  console.log("🤗 Initializing Hugging Face Computer Vision for FREE AI analysis...");
  if (huggingFaceCV.isReady()) {
    console.log("✅ Hugging Face Computer Vision activated as Roboflow alternative");
  }
  
  console.log("🎤 Initializing Advanced Speech Emotion Recognition...");
  if (speechEmotionRecognition.isReady()) {
    console.log("✅ Speech Emotion Recognition activated with wav2vec2 models");
  }
  
  console.log("😊 Initializing Advanced Facial Expression Analysis...");
  if (facialExpressionAnalysis.isReady()) {
    console.log("✅ Facial Expression Analysis activated with multiple AI services");
  }
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use environment port or default to 5000 for Replit compatibility
  const port = parseInt(process.env.PORT || "5000");
  
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();
