import KnowledgeGraph from "../components/graph/KnowledgeGraph";
import WorkspacePulse from "../components/workspace/WorkspacePulse";
import "./GraphPage.css";

const GraphPage = () => {
  return (
    <div className="graph-page">
      <div className="graph-header">
        <h1>Knowledge Graph Visualization</h1>
        <p>
          Explore document relationships in a cleaner 2D layout tied directly to
          your live workspace data.
        </p>
      </div>

      <WorkspacePulse
        compact
        title="Graph data comes from your real workspace"
        subtitle="Explore a clear 2D map, inspect nodes directly, and scroll across the full graph without losing context."
      />

      <div className="graph-container">
        <KnowledgeGraph />
      </div>

      <div className="graph-info">
        <div className="info-card">
          <h3>How to use</h3>
          <ul>
            <li>Hover over a node to reveal its details in the inspector.</li>
            <li>Scroll horizontally and vertically to explore larger graphs.</li>
            <li>
              Click a node to center that part of the graph inside the board.
            </li>
            <li>
              Document nodes anchor groups, while chunk nodes show extracted
              knowledge.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GraphPage;
