import { useEffect, useRef, useState } from "react";
import useGraph from "../../hooks/useGraph";
import "./KnowledgeGraph.css";

const BOARD_MIN_WIDTH = 1100;
const BOARD_MIN_HEIGHT = 680;
const BOARD_PADDING_X = 60;
const BOARD_PADDING_Y = 56;
const COLUMN_WIDTH = 280;
const COLUMN_GAP = 48;
const DOCUMENT_WIDTH = 240;
const DOCUMENT_HEIGHT = 88;
const CHUNK_WIDTH = 240;
const CHUNK_HEIGHT = 96;
const CHUNK_GAP = 20;
const DOCUMENT_TO_CHUNKS_GAP = 36;

export default function KnowledgeGraph() {
  const { graphData, loading, error } = useGraph();
  const scrollRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    setSelectedNode(null);
    setHoveredNode(null);
    setHoveredLink(null);
  }, [graphData]);

  const { columns, layoutNodes, layoutLinks, boardWidth, boardHeight } =
    buildBoardLayout(graphData);

  const highlightedNodeIds = new Set();
  const highlightedLinkIds = new Set();
  const activeNode = hoveredNode || selectedNode;

  if (activeNode) {
    highlightedNodeIds.add(activeNode.id);

    layoutLinks.forEach((link) => {
      if (link.sourceId === activeNode.id || link.targetId === activeNode.id) {
        highlightedNodeIds.add(link.sourceId);
        highlightedNodeIds.add(link.targetId);
        highlightedLinkIds.add(link.id);
      }
    });
  }

  if (hoveredLink) {
    highlightedNodeIds.add(hoveredLink.sourceId);
    highlightedNodeIds.add(hoveredLink.targetId);
    highlightedLinkIds.add(hoveredLink.id);
  }

  const hasHighlight =
    highlightedNodeIds.size > 0 || highlightedLinkIds.size > 0;
  const inspectedNode = hoveredNode || selectedNode;

  const handleNodeClick = (layoutNode) => {
    setSelectedNode(layoutNode.data);
    setHoveredLink(null);

    const scroller = scrollRef.current;

    if (!scroller) {
      return;
    }

    const left = Math.max(layoutNode.centerX - scroller.clientWidth / 2, 0);
    const top = Math.max(layoutNode.centerY - scroller.clientHeight / 2, 0);

    scroller.scrollTo({
      left,
      top,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="graph-state">
        <div className="spinner"></div>
        <p>Loading knowledge graph...</p>
      </div>
    );
  }

  if (error) {
    return <div className="graph-state graph-state-error">{error}</div>;
  }

  if (!graphData.nodes.length) {
    return (
      <div className="graph-state">
        <p>Upload a PDF to generate your first knowledge graph.</p>
      </div>
    );
  }

  return (
    <div className="knowledge-graph-shell">
      <div className="graph-hud">
        <div className="graph-chip">
          <strong>{graphData.nodes.length}</strong>
          <span>nodes</span>
        </div>
        <div className="graph-chip">
          <strong>{graphData.links.length}</strong>
          <span>links</span>
        </div>
        <div className="graph-chip">
          <strong>{columns.length}</strong>
          <span>columns</span>
        </div>
        <div className="graph-chip graph-chip-muted">
          Scroll horizontally and vertically. Hover or click any node to inspect
          it.
        </div>
      </div>

      <div ref={scrollRef} className="knowledge-graph-scroll">
        <div
          className="knowledge-graph-board"
          style={{ width: `${boardWidth}px`, height: `${boardHeight}px` }}
        >
          {columns.map((column) => (
            <div
              key={column.key}
              className="graph-column"
              style={{
                left: `${column.x}px`,
                top: `${column.y}px`,
                width: `${column.width}px`,
                height: `${column.height}px`,
              }}
            >
              <div className="graph-column-header">
                <span className="graph-column-title">{column.title}</span>
                <span className="graph-column-count">
                  {column.chunkCount} knowledge node
                  {column.chunkCount === 1 ? "" : "s"}
                </span>
              </div>
            </div>
          ))}

          <svg
            className="graph-links-layer"
            width={boardWidth}
            height={boardHeight}
            viewBox={`0 0 ${boardWidth} ${boardHeight}`}
            aria-hidden="true"
          >
            {layoutLinks.map((link) => {
              const isHighlighted = highlightedLinkIds.has(link.id);
              const isDimmed = hasHighlight && !isHighlighted;

              return (
                <g key={link.id}>
                  <path
                    d={link.path}
                    className={`graph-link graph-link-${link.type} ${isDimmed ? "is-dim" : ""} ${isHighlighted ? "is-highlighted" : ""}`}
                  />
                  <path
                    d={link.path}
                    className="graph-link-hit"
                    onMouseEnter={() => {
                      setHoveredLink(link);
                      setHoveredNode(null);
                    }}
                    onMouseLeave={() => setHoveredLink(null)}
                  />
                </g>
              );
            })}
          </svg>

          {layoutNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const isHovered = hoveredNode?.id === node.id;
            const isDimmed = hasHighlight && !highlightedNodeIds.has(node.id);

            return (
              <button
                key={node.id}
                type="button"
                className={`graph-node graph-node-${node.type} ${isSelected ? "is-selected" : ""} ${isHovered ? "is-hovered" : ""} ${isDimmed ? "is-dim" : ""}`}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  width: `${node.width}px`,
                  minHeight: `${node.height}px`,
                }}
                onClick={() => handleNodeClick(node)}
                onMouseEnter={() => {
                  setHoveredNode(node.data);
                  setHoveredLink(null);
                }}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div className="graph-node-heading">
                  <span className="graph-node-type">{node.data.typeLabel}</span>
                  <span className="graph-node-pill">
                    {node.data.relationshipCount} link
                    {node.data.relationshipCount === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="graph-node-title">{node.data.label}</div>
                {node.type === "chunk" ? (
                  <p className="graph-node-preview">{node.data.preview}</p>
                ) : (
                  <p className="graph-node-preview">
                    Source document anchoring this knowledge cluster.
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={`graph-inspector ${inspectedNode || hoveredLink ? "is-active" : ""}`}
      >
        {inspectedNode ? (
          <>
            <p className="graph-inspector-kicker">{inspectedNode.typeLabel}</p>
            <h3>{inspectedNode.label}</h3>
            <p>{inspectedNode.preview}</p>
            <div className="graph-inspector-metrics">
              <span>{inspectedNode.relationshipCount} connected links</span>
              {inspectedNode.documentId ? (
                <span>Attached to a source document</span>
              ) : null}
            </div>
          </>
        ) : null}

        {!inspectedNode && hoveredLink ? (
          <>
            <p className="graph-inspector-kicker">
              {hoveredLink.type === "document"
                ? "Document link"
                : "Semantic link"}
            </p>
            <h3>
              {hoveredLink.sourceLabel} to {hoveredLink.targetLabel}
            </h3>
            <p>
              {hoveredLink.type === "document"
                ? "This line connects a source document to one of its extracted knowledge nodes."
                : "This line represents a semantic relationship discovered between two knowledge nodes."}
            </p>
          </>
        ) : null}

        {!inspectedNode && !hoveredLink ? (
          <>
            <p className="graph-inspector-kicker">2D knowledge map</p>
            <h3>Everything stays visible</h3>
            <p>
              Documents are organized into columns, chunk nodes stay readable,
              and the graph area scrolls in both directions so large workspaces
              do not collapse into a tiny canvas.
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}

function buildBoardLayout(graphData) {
  const documents = graphData.nodes.filter((node) => node.type === "document");
  const chunks = graphData.nodes.filter((node) => node.type !== "document");
  const documentGroups = new Map(
    documents.map((document) => [document.id, { document, chunks: [] }]),
  );
  const ungroupedChunks = [];

  chunks.forEach((chunk) => {
    const documentKey = chunk.documentId ? `doc:${chunk.documentId}` : null;
    const group = documentKey ? documentGroups.get(documentKey) : null;

    if (group) {
      group.chunks.push(chunk);
      return;
    }

    ungroupedChunks.push(chunk);
  });

  const columns = [
    ...documents.map((document) => ({
      key: document.id,
      title: document.label,
      documentNode: document,
      chunks: [...(documentGroups.get(document.id)?.chunks || [])].sort(
        sortNodesForLayout,
      ),
    })),
  ];

  if (ungroupedChunks.length) {
    columns.push({
      key: "ungrouped",
      title: "Unlinked knowledge",
      documentNode: null,
      chunks: [...ungroupedChunks].sort(sortNodesForLayout),
    });
  }

  const visibleColumns = columns.filter(
    (column) => column.documentNode || column.chunks.length,
  );
  const layoutNodes = [];
  const layoutColumns = [];
  let maxBottom = BOARD_PADDING_Y;

  visibleColumns.forEach((column, index) => {
    const x = BOARD_PADDING_X + index * (COLUMN_WIDTH + COLUMN_GAP);
    const contentX = x + (COLUMN_WIDTH - CHUNK_WIDTH) / 2;
    let cursorY = BOARD_PADDING_Y + 20;

    if (column.documentNode) {
      layoutNodes.push(
        createLayoutNode(column.documentNode, {
          x: x + (COLUMN_WIDTH - DOCUMENT_WIDTH) / 2,
          y: cursorY,
          width: DOCUMENT_WIDTH,
          height: DOCUMENT_HEIGHT,
        }),
      );

      cursorY += DOCUMENT_HEIGHT + DOCUMENT_TO_CHUNKS_GAP;
    }

    column.chunks.forEach((chunk) => {
      layoutNodes.push(
        createLayoutNode(chunk, {
          x: contentX,
          y: cursorY,
          width: CHUNK_WIDTH,
          height: CHUNK_HEIGHT,
        }),
      );

      cursorY += CHUNK_HEIGHT + CHUNK_GAP;
    });

    const columnHeight =
      Math.max(
        column.documentNode ? DOCUMENT_HEIGHT + 42 : 70,
        cursorY - BOARD_PADDING_Y + 20,
      ) + 24;

    layoutColumns.push({
      key: column.key,
      title: column.title,
      x,
      y: BOARD_PADDING_Y,
      width: COLUMN_WIDTH,
      height: columnHeight,
      chunkCount: column.chunks.length,
    });

    maxBottom = Math.max(maxBottom, BOARD_PADDING_Y + columnHeight);
  });

  const boardWidth = Math.max(
    BOARD_MIN_WIDTH,
    BOARD_PADDING_X * 2 +
      visibleColumns.length * COLUMN_WIDTH +
      Math.max(0, visibleColumns.length - 1) * COLUMN_GAP,
  );
  const boardHeight = Math.max(BOARD_MIN_HEIGHT, maxBottom + BOARD_PADDING_Y);
  const layoutNodeMap = new Map(layoutNodes.map((node) => [node.id, node]));

  const layoutLinks = graphData.links
    .map((link, index) => {
      const sourceId = getNodeId(link.source);
      const targetId = getNodeId(link.target);
      const sourceNode = layoutNodeMap.get(sourceId);
      const targetNode = layoutNodeMap.get(targetId);

      if (!sourceNode || !targetNode) {
        return null;
      }

      return {
        id: `${link.type}-${index}-${sourceId}-${targetId}`,
        type: link.type || "semantic",
        strength: link.strength || 1,
        sourceId,
        targetId,
        sourceLabel: sourceNode.data.label,
        targetLabel: targetNode.data.label,
        path: buildLinkPath(sourceNode, targetNode, link.type || "semantic"),
      };
    })
    .filter(Boolean);

  return {
    columns: layoutColumns,
    layoutNodes,
    layoutLinks,
    boardWidth,
    boardHeight,
  };
}

function createLayoutNode(node, position) {
  return {
    ...position,
    id: node.id,
    type: node.type,
    centerX: position.x + position.width / 2,
    centerY: position.y + position.height / 2,
    data: node,
  };
}

function sortNodesForLayout(a, b) {
  const relationshipDelta = (b.relationshipCount || 0) - (a.relationshipCount || 0);

  if (relationshipDelta !== 0) {
    return relationshipDelta;
  }

  return a.label.localeCompare(b.label);
}

function getNodeId(node) {
  return typeof node === "object" ? node.id : node;
}

function buildLinkPath(sourceNode, targetNode, type) {
  if (type === "document") {
    const startX = sourceNode.centerX;
    const startY = sourceNode.y + sourceNode.height;
    const endX = targetNode.centerX;
    const endY = targetNode.y;
    const controlY = startY + (endY - startY) / 2;

    return `M ${startX} ${startY} Q ${startX} ${controlY} ${endX} ${endY}`;
  }

  const start = getNodeAnchor(sourceNode, targetNode.centerX, targetNode.centerY);
  const end = getNodeAnchor(targetNode, sourceNode.centerX, sourceNode.centerY);
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  const arch = Math.max(
    28,
    Math.min(120, Math.abs(end.x - start.x) * 0.14 + Math.abs(end.y - start.y) * 0.08),
  );

  return `M ${start.x} ${start.y} Q ${midX} ${midY - arch} ${end.x} ${end.y}`;
}

function getNodeAnchor(node, towardX, towardY) {
  const deltaX = towardX - node.centerX;
  const deltaY = towardY - node.centerY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return {
      x: node.centerX + (deltaX > 0 ? node.width / 2 : -node.width / 2),
      y: node.centerY,
    };
  }

  return {
    x: node.centerX,
    y: node.centerY + (deltaY > 0 ? node.height / 2 : -node.height / 2),
  };
}
