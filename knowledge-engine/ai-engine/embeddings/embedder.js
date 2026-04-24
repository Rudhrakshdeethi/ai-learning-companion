import { GoogleGenAI } from "@google/genai";
import MODEL_CONFIG from "../config/modelConfig.js";

let client;

const getClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  if (!client) {
    client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  return client;
};

export const createEmbedding = async (
  text,
  { taskType = "RETRIEVAL_DOCUMENT" } = {},
) => {
  if (!text || text.trim().length === 0) return null;

  const response = await getClient().models.embedContent({
    model: MODEL_CONFIG.embedding.model,
    contents: text,
    config: {
      taskType,
    },
  });

  return response.embeddings?.[0]?.values ?? null;
};
