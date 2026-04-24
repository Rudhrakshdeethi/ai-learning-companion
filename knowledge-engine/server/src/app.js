import express from "express";
import fs from "fs";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import uploadRoutes from "./routes/uploadRoutes.js";
import queryRoutes from "./routes/queryRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { getAvailableLlmProviders } from "../../ai-engine/reasoning/llmService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;
const clientDistPath = path.join(__dirname, "../../client/dist");

// middleware
app.use(cors());
app.use(express.json());

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

// routes
app.use("/api/upload", uploadRoutes);
app.use("/api/query", queryRoutes);
app.use("/api/workspace", workspaceRoutes);
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    databaseConnected: mongoose.connection.readyState === 1,
    llmProviders: getAvailableLlmProviders(),
    timestamp: new Date().toISOString(),
  });
});

// catch-all handler: send back index.html for any non-API routes
if (fs.existsSync(clientDistPath)) {
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

// error handler
app.use(errorHandler);
console.log(
  "LLM providers:",
  getAvailableLlmProviders()
    .map((provider) => `${provider.name}:${provider.configured ? "ready" : "skip"}`)
    .join(", "),
);
// DB + server start (merged here)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });
