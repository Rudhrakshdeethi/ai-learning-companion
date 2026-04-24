import pdfQueue from "../queue/queue.js";
import Chunk from "../../server/src/models/Chunk.js";
import { buildConnections } from "../../ai-engine/graph/connectionBuilder.js";
import { createChunkObject } from "../../shared/schemas/chunk.schema.js";
import { parsePDF } from "../processors/pdfParser.js";
import { chunkText } from "../processors/chunker.js";
import { processEmbeddings } from "../processors/embeddingProcessor.js";

export const processPdfJob = async ({ filePath, docId }) => {
  const text = await parsePDF(filePath);
  const chunks = chunkText(text);
  const embeddedChunks = await processEmbeddings(chunks);

  const chunkPayload = embeddedChunks.map(({ text: chunkTextValue, embedding }) =>
    createChunkObject({
      text: chunkTextValue,
      embedding,
      documentId: docId,
    }),
  );

  const savedChunks = chunkPayload.length
    ? await Chunk.insertMany(chunkPayload)
    : [];

  const connectionCount =
    savedChunks.length > 1 ? await buildConnections(savedChunks) : 0;

  return {
    count: savedChunks.length,
    connectionCount,
    textLength: text.length,
  };
};

export const addPdfJob = async (filePath, docId) => {
  return pdfQueue.add({ filePath, docId }, processPdfJob);
};
