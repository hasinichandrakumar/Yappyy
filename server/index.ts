import express, { type Request, Response, NextFunction } from "express";
import { setDefaultResultOrder } from "node:dns";
import { registerSimplifiedRoutes } from "./simplified-backend";
import { setupVite, serveStatic, log } from "./vite";

// Prefer IPv4 to avoid TLS handshake failures on hosts with broken IPv6
try {
  setDefaultResultOrder('ipv4first');
} catch {}

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Trust proxy so secure cookies and HTTPS detection work behind load balancers/CDNs
app.set('trust proxy', 1);
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
  console.log("🚀 Starting Simplified Backend - Core Recording Functionality");
  console.log("✅ No external AI dependencies required");
  
  const server = await registerSimplifiedRoutes(app);

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

  // Use environment port or default to 5000 for Replit workflow compatibility
  const port = parseInt(process.env.PORT || "5000");
  const host = process.env.HOST || "0.0.0.0"; // bind IPv4

  server.listen(port, host, () => {
    log(`🚀 Simplified backend serving on port ${port}`);
    log(`✅ Core recording functionality ready`);
    log(`✅ Filler word detection active`);
    log(`✅ Session analysis available`);
    log(`✅ Google OAuth configured`);
  });
})();
