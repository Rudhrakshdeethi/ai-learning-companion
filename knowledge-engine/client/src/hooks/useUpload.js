import { useState } from "react";
import { uploadPDF } from "../services/api";
import workspaceStore from "../store/workspaceStore";

export default function useUpload() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleUpload = async (file) => {
    if (!file) return;

    setLoading(true);
    setStatus("Learning from document...");

    try {
      const res = await uploadPDF(file);
      setStatus(
        `Learned ${res.count} chunks and built ${res.connectionCount} connections`,
      );
      workspaceStore.notify();
      return res;
    } catch (err) {
      setStatus(err.message || "Upload failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpload, loading, status };
}
