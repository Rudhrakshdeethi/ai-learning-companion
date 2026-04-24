import { createEmbedding } from "../../../ai-engine/embeddings/embedder.js";
import { findRelevantChunks } from "../../../ai-engine/retrieval/vectorSearch.js";
import { MAX_CONTEXT_CHUNKS } from "../../../shared/constants/system.js";

export const getRelevantContext = async (question) => {
  const queryEmbedding = await createEmbedding(question, {
    taskType: "RETRIEVAL_QUERY",
  });

  const chunks = await findRelevantChunks(queryEmbedding, MAX_CONTEXT_CHUNKS);

  return chunks;
};
