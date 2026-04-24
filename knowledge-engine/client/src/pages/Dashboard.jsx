import { Link } from "react-router-dom";
import WorkspacePulse from "../components/workspace/WorkspacePulse";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <header>
        <h1>AI Learning Companion</h1>
        <p>Your intelligent workspace for learning from documents</p>
      </header>

      <WorkspacePulse
        title="Your workspace stays in sync across every page"
        subtitle="Upload a document, ask a question, or open the graph and the same workspace data follows you through the app."
      />

      <main>
        <div className="features">
          <div className="feature-card">
            <h3>Document Upload</h3>
            <p>Bring PDFs into the workspace and index them for retrieval.</p>
          </div>
          <div className="feature-card">
            <h3>AI Chat</h3>
            <p>
              Ask questions against the same documents and keep the conversation
              live.
            </p>
          </div>
          <div className="feature-card">
            <h3>Knowledge Graph</h3>
            <p>
              Explore a connected 2D graph of documents and knowledge units.
            </p>
          </div>
          <div className="feature-card">
            <h3>Memory Panel</h3>
            <p>
              Review the latest answers and insights already saved in the
              workspace.
            </p>
          </div>
        </div>

        <Link to="/workspace" className="start-button">
          Enter Workspace
        </Link>
      </main>
    </div>
  );
};

export default Dashboard;
