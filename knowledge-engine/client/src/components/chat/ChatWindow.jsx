import { useState } from "react";
import useChat from "../../hooks/useChat";
import MessageBubble from "./MessageBubble";
import "./ChatWindow.css";

export default function ChatWindow() {
  const { messages, sendMessage, loading } = useChat();
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || loading) return;

    void sendMessage(input);
    setInput("");
  };

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}
        {loading ? (
          <div className="chat-loading">
            Searching your document knowledge...
          </div>
        ) : null}
      </div>

      <div className="chat-compose">
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          placeholder="Ask a question about your uploaded documents"
        />

        <button onClick={handleSend} className="chat-button" disabled={loading}>
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
}
