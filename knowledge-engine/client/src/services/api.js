const BASE_URL = "http://localhost:5000/api";

const requestJson = async (path, options = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
};

export const uploadPDF = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return requestJson("/upload", {
    method: "POST",
    body: formData,
  });
};

export const askQuestion = async (question) => {
  return requestJson("/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });
};

export const fetchKnowledgeGraph = async () => requestJson("/workspace/graph");

export const fetchMemories = async () => requestJson("/workspace/memory");

export const fetchWorkspaceSummary = async () =>
  requestJson("/workspace/summary");

export const fetchDocuments = async () => requestJson("/workspace/documents");

export const removeDocument = async (documentId) =>
  requestJson(`/workspace/documents/${documentId}`, {
    method: "DELETE",
  });
