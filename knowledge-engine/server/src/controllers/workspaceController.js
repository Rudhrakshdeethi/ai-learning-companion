import {
  getDocuments,
  getGraphData,
  getRecentQueries,
  getWorkspaceSummary,
  removeDocument,
} from "../services/workspaceService.js";

export const getSummary = async (req, res) => {
  try {
    const summary = await getWorkspaceSummary();
    res.json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Failed to load summary" });
  }
};

export const getMemory = async (req, res) => {
  try {
    const queries = await getRecentQueries();
    res.json({ queries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Failed to load memory" });
  }
};

export const getGraph = async (req, res) => {
  try {
    const graph = await getGraphData();
    res.json(graph);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Failed to load graph" });
  }
};

export const listDocuments = async (req, res) => {
  try {
    const documents = await getDocuments();
    res.json({ documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Failed to load documents" });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    await removeDocument(documentId);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Failed to delete document" });
  }
};
