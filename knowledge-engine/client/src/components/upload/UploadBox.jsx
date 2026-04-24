import { useEffect, useState } from "react";
import useUpload from "../../hooks/useUpload";
import { fetchDocuments, removeDocument } from "../../services/api";
import workspaceStore from "../../store/workspaceStore";
import { formatDate } from "../../utils/helpers";
import "./UploadBox.css";

export default function UploadBox() {
  const { handleUpload, status, loading } = useUpload();
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const data = await fetchDocuments();
        setDocuments(data.documents || []);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to load documents");
      }
    };

    void loadDocuments();

    const unsubscribe = workspaceStore.subscribe(() => {
      void loadDocuments();
    });

    return unsubscribe;
  }, []);

  const handleDelete = async (documentId) => {
    const confirmed = window.confirm(
      "Remove this document and its generated chunks from the workspace?",
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(documentId);

    try {
      await removeDocument(documentId);
      workspaceStore.notify();
    } catch (err) {
      setError(err.message || "Failed to delete document");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="upload-box">
      <label htmlFor="file-input" className="upload-label">
        <input
          id="file-input"
          type="file"
          accept="application/pdf"
          disabled={loading}
          onChange={(e) => {
            const [file] = e.target.files || [];
            if (file) {
              void handleUpload(file);
            }
          }}
        />
        <div className="upload-content">
          <span className="upload-icon">PDF</span>
          <span className="upload-text">
            {loading ? "Processing..." : "Click to upload or drag and drop"}
          </span>
          <span className="upload-subtext">PDF files only</span>
        </div>
      </label>

      <p className="status-text">{status || "Choose a PDF to ingest it."}</p>

      {error ? <p className="status-text upload-error">{error}</p> : null}

      <div className="document-list">
        {documents.length ? (
          documents.map((document) => (
            <div key={document.id} className="document-item">
              <div>
                <div className="document-name">{document.filename}</div>
                <div className="document-meta">
                  {document.chunkCount} chunks
                  {document.uploadedAt ? ` · ${formatDate(document.uploadedAt)}` : ""}
                </div>
              </div>
              <button
                className="document-delete"
                disabled={deletingId === document.id}
                onClick={() => void handleDelete(document.id)}
              >
                {deletingId === document.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))
        ) : (
          <p style={{ color: "#999", textAlign: "center", marginTop: "1rem" }}>
            No documents uploaded yet. Upload your first document to get started!
          </p>
        )}
      </div>
    </div>
  );
}
