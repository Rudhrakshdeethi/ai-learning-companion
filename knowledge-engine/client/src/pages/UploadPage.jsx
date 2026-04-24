import UploadBox from "../components/upload/UploadBox";
import WorkspacePulse from "../components/workspace/WorkspacePulse";
import "./UploadPage.css";

const UploadPage = () => {
  return (
    <div className="upload-page">
      <div className="upload-container">
        <div className="upload-header">
          <h1>Build Your Knowledge Base</h1>
          <p>
            Add PDF documents once and use them across the workspace, chat,
            memory, and graph views.
          </p>
        </div>

        <WorkspacePulse
          compact
          title="Uploads feed the whole workspace"
          subtitle="Every document you ingest appears in the document list, graph relationships, and chat retrieval flow."
        />

        <div className="upload-content">
          <div className="upload-section">
            <h2>Upload Documents</h2>
            <p className="upload-description">
              Drop in a PDF and the workspace will process it into searchable
              chunks and graph relationships.
            </p>
            <UploadBox />
          </div>

          <div className="features-section">
            <h2>What happens next</h2>
            <div className="features-grid">
              <div className="feature">
                <h3>Smart Extraction</h3>
                <p>
                  The system breaks your document into meaningful knowledge
                  units for search and reasoning.
                </p>
              </div>
              <div className="feature">
                <h3>Relationship Building</h3>
                <p>
                  Related concepts are linked together so the graph reflects
                  real workspace structure.
                </p>
              </div>
              <div className="feature">
                <h3>Live Sync</h3>
                <p>
                  New uploads refresh the workspace summary, document list, and
                  graph experience automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
