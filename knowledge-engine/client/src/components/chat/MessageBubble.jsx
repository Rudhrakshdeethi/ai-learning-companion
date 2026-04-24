import { useState } from "react";
import { truncateText } from "../../utils/helpers";
import "./MessageBubble.css";

export default function MessageBubble({ message }) {
  const [showSources, setShowSources] = useState(false);

  const isUser = message.role === "user";
  const isError = Boolean(message.isError);

  return (
    <div className={`message-row ${isUser ? "message-row-user" : ""}`}>
      <div
        className={`message-bubble ${isUser ? "message-bubble-user" : ""} ${
          isError ? "message-bubble-error" : ""
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>

        {!isUser && message.sources?.length ? (
          <div className="message-sources">
            <button
              onClick={() => setShowSources(!showSources)}
              className="message-sources-toggle"
            >
              {showSources ? "Hide sources" : "View sources"}
            </button>

            {showSources && (
              <div className="message-source-list">
                {message.sources.map((src, i) => (
                  <div key={src.id || i} className="message-source-item">
                    {truncateText(src.text || String(src), 220)}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
