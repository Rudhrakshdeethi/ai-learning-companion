import { GoogleGenAI } from "@google/genai";
import MODEL_CONFIG from "../config/modelConfig.js";

const SYSTEM_PROMPT =
  'You are a precise knowledge assistant. Answer only using the provided context. If the answer is not in the context, say "Not found in documents."';

let geminiClient;

const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  return geminiClient;
};

const buildMessages = (question, chunks) => {
  const context = chunks.map((chunk) => chunk.text).join("\n\n");

  return [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    {
      role: "user",
      content: `Context:\n${context}\n\nQuestion:\n${question}`,
    },
  ];
};

const buildPrompt = (question, chunks) =>
  buildMessages(question, chunks)
    .map((message) => `${message.role.toUpperCase()}:\n${message.content}`)
    .join("\n\n");

const extractContent = (payload) =>
  payload?.choices?.[0]?.message?.content?.trim() || null;

const getProviderConfig = (provider) => MODEL_CONFIG.llm[provider] || {};

const isProviderConfigured = (provider) => {
  if (provider === "local") {
    return true;
  }

  const envKey = getProviderConfig(provider).envKey;
  return Boolean(envKey && process.env[envKey]);
};

const requestChatCompletion = async ({
  url,
  apiKey,
  model,
  question,
  chunks,
  extraHeaders = {},
}) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...extraHeaders,
    },
    body: JSON.stringify({
      model,
      messages: buildMessages(question, chunks),
      temperature: MODEL_CONFIG.llm.temperature,
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      payload?.error?.message ||
        payload?.message ||
        `Provider request failed with ${response.status}`,
    );
    error.status = response.status;
    error.providerPayload = payload;
    throw error;
  }

  const text = extractContent(payload);

  if (!text) {
    throw new Error("Provider returned an empty response");
  }

  return text;
};

const generateWithGroq = async (question, chunks) => {
  const config = getProviderConfig("groq");

  return requestChatCompletion({
    url: "https://api.groq.com/openai/v1/chat/completions",
    apiKey: process.env[config.envKey],
    model: config.model,
    question,
    chunks,
  });
};

const generateWithOpenRouter = async (question, chunks) => {
  const config = getProviderConfig("openrouter");

  return requestChatCompletion({
    url: "https://openrouter.ai/api/v1/chat/completions",
    apiKey: process.env[config.envKey],
    model: config.model,
    question,
    chunks,
    extraHeaders: {
      "HTTP-Referer":
        process.env.OPENROUTER_SITE_URL || "http://localhost:5173",
      "X-Title":
        process.env.OPENROUTER_APP_NAME || "AI Learning Companion",
    },
  });
};

const generateWithGemini = async (question, chunks) => {
  const response = await getGeminiClient().models.generateContent({
    model: getProviderConfig("gemini").model,
    contents: buildPrompt(question, chunks),
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: MODEL_CONFIG.llm.temperature,
    },
  });

  const text = response.text?.trim();

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  return text;
};

const sentenceSplit = (text) =>
  text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

const normalizeToken = (token) => token.toLowerCase().replace(/[^a-z0-9]/g, "");

const buildKeywordSet = (question) =>
  new Set(
    question
      .split(/\s+/)
      .map(normalizeToken)
      .filter((token) => token.length > 2),
  );

const scoreSentence = (sentence, keywords) => {
  const tokens = sentence
    .split(/\s+/)
    .map(normalizeToken)
    .filter(Boolean);

  const uniqueTokens = new Set(tokens);
  let matches = 0;

  for (const keyword of keywords) {
    if (uniqueTokens.has(keyword)) {
      matches += 1;
    }
  }

  return matches;
};

const generateLocally = async (question, chunks) => {
  const keywords = buildKeywordSet(question);
  const candidates = chunks.flatMap((chunk) =>
    sentenceSplit(chunk.text).map((sentence) => ({
      sentence,
      score: scoreSentence(sentence, keywords) + (chunk.score || 0),
    })),
  );

  const bestSentences = candidates
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((entry) => entry.sentence)
    .filter(Boolean);

  if (!bestSentences.length) {
    return "Not found in documents.";
  }

  return bestSentences.join(" ");
};

const providerHandlers = {
  groq: generateWithGroq,
  openrouter: generateWithOpenRouter,
  gemini: generateWithGemini,
  local: generateLocally,
};

export const getAvailableLlmProviders = () =>
  MODEL_CONFIG.llm.providers.map((provider) => ({
    name: provider,
    configured: isProviderConfigured(provider),
  }));

export const generateAnswer = async (question, chunks) => {
  if (!chunks.length) {
    return "Not found in documents.";
  }

  let lastError;

  for (const provider of MODEL_CONFIG.llm.providers) {
    if (!isProviderConfigured(provider)) {
      continue;
    }

    try {
      return await providerHandlers[provider](question, chunks);
    } catch (error) {
      error.provider = provider;
      lastError = error;
    }
  }

  if (lastError) {
    throw lastError;
  }

  return "Not found in documents.";
};
