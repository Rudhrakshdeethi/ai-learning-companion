import Chunk from "../../server/src/models/Chunk.js";
import { MAX_CONTEXT_CHUNKS } from "../../shared/constants/system.js";
import { cosineSimilarity } from "../../shared/utils/scoring.js";

export const findRelevantChunks = async (
  queryEmbedding,
  limit = MAX_CONTEXT_CHUNKS,
) => {
  if (!Array.isArray(queryEmbedding) || !queryEmbedding.length) {
    return [];
  }

  const chunks = await Chunk.find({
    embedding: { $exists: true, $ne: [] },
  }).lean();

  const scored = chunks.map((chunk) => ({
    ...chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  return scored
    .filter((chunk) => Number.isFinite(chunk.score))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};
