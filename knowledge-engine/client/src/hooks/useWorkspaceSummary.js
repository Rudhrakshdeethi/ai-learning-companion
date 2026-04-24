import { useEffect, useState } from "react";
import { fetchWorkspaceSummary } from "../services/api";
import workspaceStore from "../store/workspaceStore";

export default function useWorkspaceSummary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true);

      try {
        const data = await fetchWorkspaceSummary();
        setSummary(data);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to load workspace summary");
      } finally {
        setLoading(false);
      }
    };

    void loadSummary();

    const unsubscribe = workspaceStore.subscribe(() => {
      void loadSummary();
    });

    return unsubscribe;
  }, []);

  return { summary, loading, error };
}
