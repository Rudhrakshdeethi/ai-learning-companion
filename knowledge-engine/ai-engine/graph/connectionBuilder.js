import Connection from "../../server/src/models/Connection.js";
import {
  CONNECTION_LOOKAHEAD,
  CONNECTION_SIMILARITY_THRESHOLD,
  MAX_CONNECTIONS_PER_CHUNK,
} from "../../shared/constants/system.js";
import { cosineSimilarity } from "../../shared/utils/scoring.js";

export const buildConnections = async (chunks) => {
  const connections = [];

  for (let i = 0; i < chunks.length; i++) {
    const bestMatches = [];
    const lastIndex = Math.min(chunks.length, i + CONNECTION_LOOKAHEAD + 1);

    for (let j = i + 1; j < lastIndex; j++) {
      if (!chunks[i].embedding?.length || !chunks[j].embedding?.length) {
        continue;
      }

      const sim = cosineSimilarity(chunks[i].embedding, chunks[j].embedding);

      if (
        Number.isFinite(sim) &&
        sim >= CONNECTION_SIMILARITY_THRESHOLD
      ) {
        bestMatches.push({
          chunkA: chunks[i]._id,
          chunkB: chunks[j]._id,
          strength: sim,
        });
      }
    }

    bestMatches
      .sort((a, b) => b.strength - a.strength)
      .slice(0, MAX_CONNECTIONS_PER_CHUNK)
      .forEach((connection) => {
        connections.push(connection);
      });
  }

  if (connections.length > 0) {
    await Connection.insertMany(connections);
  }

  return connections.length;
};
