import ChatWindow from "../components/chat/ChatWindow";
import WorkspacePulse from "../components/workspace/WorkspacePulse";
import "./ChatPage.css";

const ChatPage = () => {
  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-header">
          <h1>AI Chat Assistant</h1>
          <p>
            Ask questions about the same documents you uploaded into the
            workspace and keep the conversation synced between pages.
          </p>
        </div>

        <WorkspacePulse
          compact
          title="Chat shares the same workspace memory"
          subtitle="Questions asked here show up in the memory panel and contribute to the live workspace summary."
        />

        <div className="chat-wrapper">
          <ChatWindow />
        </div>

        <div className="chat-footer">
          <div className="tips">
            <h3>Tips for better answers</h3>
            <ul>
              <li>Ask specific questions about your documents.</li>
              <li>Use terms that appear in the uploaded material.</li>
              <li>Break bigger questions into smaller follow-ups.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
