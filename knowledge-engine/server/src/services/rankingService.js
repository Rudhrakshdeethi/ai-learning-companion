import { MIN_CONTEXT_SCORE } from "../../../shared/constants/system.js";

export const rankChunks = (chunks) => {
  // placeholder for future intelligence
  // later: recency, frequency, importance

  return [...chunks]
    .filter((chunk) => (chunk.score ?? 0) >= MIN_CONTEXT_SCORE)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
};
