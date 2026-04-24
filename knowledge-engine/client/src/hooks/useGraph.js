import { useState, useEffect } from "react";
import { fetchKnowledgeGraph } from "../services/api";
import workspaceStore from "../store/workspaceStore";

export default function useGraph() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadGraph = async () => {
      setLoading(true);

      try {
        const data = await fetchKnowledgeGraph();
        const processedData = enrichGraphData(data);
        setGraphData(processedData);
        setError("");
      } catch (err) {
        setGraphData({ nodes: [], links: [] });
        setError(err.message || "Unable to load the knowledge graph right now.");
      } finally {
        setLoading(false);
      }
    };

    void loadGraph();

    const unsubscribe = workspaceStore.subscribe(() => {
      void loadGraph();
    });

    return unsubscribe;
  }, []);

  return { graphData, loading, error };
}

function enrichGraphData(data) {
  const rawNodes = data.nodes || [];
  const rawLinks = data.links || [];
  const relationshipCount = new Map();

  rawLinks.forEach((link) => {
    const sourceId = getNodeId(link.source);
    const targetId = getNodeId(link.target);
    relationshipCount.set(sourceId, (relationshipCount.get(sourceId) || 0) + 1);
    relationshipCount.set(targetId, (relationshipCount.get(targetId) || 0) + 1);
  });

  return {
    nodes: rawNodes.map((node, index) => {
      const type = node.type || "chunk";
      const connections = relationshipCount.get(node.id) || 0;
      const isDocument = type === "document";
      const palette = getPalette(type, index);

      return {
        ...node,
        type,
        typeLabel: isDocument ? "Document" : "Knowledge unit",
        preview: node.label,
        relationshipCount: connections,
        val: isDocument
          ? Math.min(26, 14 + connections * 1.2)
          : Math.min(16, 6 + connections * 0.9),
        color: palette.color,
        glowColor: palette.glowColor,
      };
    }),
    links: rawLinks.map((link) => ({
      ...link,
      source: getNodeId(link.source),
      target: getNodeId(link.target),
      type: link.type || "semantic",
      strength: link.strength || 1,
    })),
  };
}

function getNodeId(node) {
  return typeof node === "object" ? node.id : node;
}

function getPalette(type, index) {
  if (type === "document") {
    return {
      color: ["#7dd3fc", "#67e8f9", "#a7f3d0"][index % 3],
      glowColor: "#e0f2fe",
    };
  }

  const chunkPalette = [
    { color: "#f59e0b", glowColor: "#fde68a" },
    { color: "#fb7185", glowColor: "#fecdd3" },
    { color: "#c084fc", glowColor: "#e9d5ff" },
    { color: "#22c55e", glowColor: "#bbf7d0" },
    { color: "#38bdf8", glowColor: "#bae6fd" },
    { color: "#f97316", glowColor: "#fed7aa" },
  ];

  return chunkPalette[index % chunkPalette.length];
}
