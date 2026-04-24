import { createEmbedding } from "../../ai-engine/embeddings/embedder.js";

export const processEmbeddings = async (chunks) => {
  const results = [];

  for (const chunk of chunks) {
    const embedding = await createEmbedding(chunk);

    if (embedding?.length) {
      results.push({
        text: chunk,
        embedding,
      });
    }
  }

  return results;
};
