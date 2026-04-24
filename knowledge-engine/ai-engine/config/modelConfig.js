const MODEL_CONFIG = {
  embedding: {
    model: "gemini-embedding-001",
  },
  llm: {
    providers: [
      "groq",
      "openrouter",
      "gemini",
      "local",
    ],
    temperature: 0.2,
    groq: {
      model: "llama-3.1-8b-instant",
      envKey: "GROQ_API_KEY",
    },
    openrouter: {
      model: "meta-llama/llama-3.1-8b-instruct",
      envKey: "OPENROUTER_API_KEY",
    },
    gemini: {
      model: "gemini-2.5-flash",
      envKey: "GEMINI_API_KEY",
    },
    local: {
      model: "extractive-fallback",
    },
  },
};

export default MODEL_CONFIG;
