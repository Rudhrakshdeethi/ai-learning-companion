import mongoose from "mongoose";
import { getAvailableLlmProviders } from "../../../ai-engine/reasoning/llmService.js";

import Chunk from "../models/Chunk.js";
import Connection from "../models/Connection.js";
import Document from "../models/Document.js";
import Query from "../models/Query.js";

const GRAPH_NODE_LIMIT = 40;
const MEMORY_LIMIT = 10;

const formatChunkLabel = (text) => {
  const compact = text.replace(/\s+/g, " ").trim();
  return compact.length > 80 ? `${compact.slice(0, 80)}...` : compact;
};

export const getWorkspaceSummary = async () => {
  const [documentCount, chunkCount, connectionCount, queryCount] =
    await Promise.all([
      Document.countDocuments(),
      Chunk.countDocuments(),
      Connection.countDocuments(),
      Query.countDocuments(),
    ]);

  return {
    documentCount,
    chunkCount,
    connectionCount,
    queryCount,
    llmProviders: getAvailableLlmProviders(),
    databaseConnected: mongoose.connection.readyState === 1,
  };
};

export const getRecentQueries = async () => {
  const queries = await Query.find()
    .sort({ createdAt: -1 })
    .limit(MEMORY_LIMIT)
    .lean();

  return queries.map((query) => ({
    id: query._id.toString(),
    question: query.question,
    answer: query.answer,
    createdAt: query.createdAt,
  }));
};

export const getDocuments = async () => {
  const [documents, chunkCounts] = await Promise.all([
    Document.find().sort({ uploadedAt: -1 }).lean(),
    Chunk.aggregate([
      {
        $group: {
          _id: "$documentId",
          chunkCount: { $sum: 1 },
        },
      },
    ]),
  ]);

  const chunkCountMap = new Map(
    chunkCounts.map((entry) => [entry._id.toString(), entry.chunkCount]),
  );

  return documents.map((doc) => ({
    id: doc._id.toString(),
    filename: doc.filename,
    uploadedAt: doc.uploadedAt,
    chunkCount: chunkCountMap.get(doc._id.toString()) ?? 0,
  }));
};

export const removeDocument = async (documentId) => {
  const chunkIds = await Chunk.find({ documentId }).distinct("_id");

  await Promise.all([
    Connection.deleteMany({
      $or: [
        { chunkA: { $in: chunkIds } },
        { chunkB: { $in: chunkIds } },
      ],
    }),
    Query.updateMany(
      {},
      {
        $pull: {
          chunksUsed: { $in: chunkIds },
        },
      },
    ),
    Chunk.deleteMany({ documentId }),
    Document.findByIdAndDelete(documentId),
  ]);
};

export const getGraphData = async () => {
  const chunks = await Chunk.find()
    .sort({ createdAt: -1 })
    .limit(GRAPH_NODE_LIMIT)
    .lean();

  if (!chunks.length) {
    return { nodes: [], links: [] };
  }

  const chunkIdSet = new Set(chunks.map((chunk) => chunk._id.toString()));
  const documentIds = [...new Set(chunks.map((chunk) => chunk.documentId?.toString()))]
    .filter(Boolean);

  const [documents, connections] = await Promise.all([
    Document.find({ _id: { $in: documentIds } }).lean(),
    Connection.find({
      chunkA: { $in: chunks.map((chunk) => chunk._id) },
      chunkB: { $in: chunks.map((chunk) => chunk._id) },
    }).lean(),
  ]);

  const nodes = [
    ...documents.map((doc) => ({
      id: `doc:${doc._id.toString()}`,
      label: doc.filename,
      type: "document",
      val: 18,
    })),
    ...chunks.map((chunk) => ({
      id: chunk._id.toString(),
      label: formatChunkLabel(chunk.text),
      type: "chunk",
      val: 8,
      documentId: chunk.documentId?.toString(),
    })),
  ];

  const links = [
    ...chunks
      .filter((chunk) => chunk.documentId)
      .map((chunk) => ({
        source: `doc:${chunk.documentId.toString()}`,
        target: chunk._id.toString(),
        type: "document",
        strength: 1,
      })),
    ...connections
      .filter(
        (connection) =>
          chunkIdSet.has(connection.chunkA.toString()) &&
          chunkIdSet.has(connection.chunkB.toString()),
      )
      .map((connection) => ({
        source: connection.chunkA.toString(),
        target: connection.chunkB.toString(),
        type: "semantic",
        strength: connection.strength,
      })),
  ];

  return { nodes, links };
};
