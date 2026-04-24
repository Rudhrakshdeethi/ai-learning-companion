import { Link } from "react-router-dom";
import UploadBox from "../components/upload/UploadBox";
import ChatWindow from "../components/chat/ChatWindow";
import KnowledgeGraph from "../components/graph/KnowledgeGraph";
import MemoryPanel from "../components/memory/MemoryPanel";
import WorkspacePulse from "../components/workspace/WorkspacePulse";

const Workspace = () => {
  return (
    <div className="workspace">
      <header className="workspace-header">
        <Link to="/" className="back-link">
          Back to Dashboard
        </Link>
        <h1>Knowledge Workspace</h1>
      </header>

      <div className="workspace-summary">
        <WorkspacePulse
          compact
          title="Everything in this workspace is connected"
          subtitle="Uploads refresh the graph, questions update memory, and every page reflects the same underlying data."
        />
      </div>

      <div className="workspace-content">
        <div className="left-panel">
          <div className="panel">
            <h2>Document Upload</h2>
            <UploadBox />
          </div>
          <div className="panel">
            <h2>Memory Panel</h2>
            <MemoryPanel />
          </div>
        </div>
        <div className="center-panel">
          <div className="panel">
            <h2>Knowledge Graph</h2>
            <KnowledgeGraph />
          </div>
        </div>
        <div className="right-panel">
          <div className="panel">
            <h2>AI Chat</h2>
            <ChatWindow />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
