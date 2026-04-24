import { Link } from "react-router-dom";
import useWorkspaceSummary from "../../hooks/useWorkspaceSummary";
import "./WorkspacePulse.css";

const SUMMARY_ITEMS = [
  { key: "documentCount", label: "Documents" },
  { key: "chunkCount", label: "Knowledge units" },
  { key: "connectionCount", label: "Connections" },
  { key: "queryCount", label: "Questions asked" },
];

export default function WorkspacePulse({
  title = "One workspace, shared everywhere",
  subtitle = "Upload, chat, memory, and graph views now point to the same live workspace data.",
  compact = false,
}) {
  const { summary, loading, error } = useWorkspaceSummary();

  return (
    <section className={`workspace-pulse ${compact ? "workspace-pulse-compact" : ""}`}>
      <div className="workspace-pulse-copy">
        <p className="workspace-pulse-kicker">Live workspace</p>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      <div className="workspace-pulse-actions">
        <Link to="/workspace" className="workspace-pulse-link">
          Open workspace
        </Link>
        <Link to="/upload" className="workspace-pulse-link workspace-pulse-link-muted">
          Upload docs
        </Link>
        <Link to="/chat" className="workspace-pulse-link workspace-pulse-link-muted">
          Ask questions
        </Link>
        <Link to="/graph" className="workspace-pulse-link workspace-pulse-link-muted">
          Explore graph
        </Link>
      </div>

      {loading ? (
        <div className="workspace-pulse-grid">
          {SUMMARY_ITEMS.map((item) => (
            <div key={item.key} className="workspace-pulse-card workspace-pulse-card-loading">
              <span className="workspace-pulse-value">...</span>
              <span className="workspace-pulse-label">{item.label}</span>
            </div>
          ))}
        </div>
      ) : null}

      {!loading && summary ? (
        <div className="workspace-pulse-grid">
          {SUMMARY_ITEMS.map((item) => (
            <div key={item.key} className="workspace-pulse-card">
              <span className="workspace-pulse-value">{summary[item.key] ?? 0}</span>
              <span className="workspace-pulse-label">{item.label}</span>
            </div>
          ))}
        </div>
      ) : null}

      <div className="workspace-pulse-footer">
        {summary ? (
          <>
            <span className={`workspace-pulse-badge ${summary.databaseConnected ? "is-live" : "is-offline"}`}>
              {summary.databaseConnected ? "Database connected" : "Database offline"}
            </span>
            <span className="workspace-pulse-meta">
              {summary.llmProviders?.length || 0} model provider
              {(summary.llmProviders?.length || 0) === 1 ? "" : "s"} available
            </span>
          </>
        ) : null}
        {error ? <span className="workspace-pulse-error">{error}</span> : null}
      </div>
    </section>
  );
}
