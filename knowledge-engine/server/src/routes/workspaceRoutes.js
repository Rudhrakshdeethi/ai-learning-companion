import express from "express";

import {
  deleteDocument,
  getGraph,
  getMemory,
  getSummary,
  listDocuments,
} from "../controllers/workspaceController.js";

const router = express.Router();

router.get("/summary", getSummary);
router.get("/memory", getMemory);
router.get("/graph", getGraph);
router.get("/documents", listDocuments);
router.delete("/documents/:documentId", deleteDocument);

export default router;
