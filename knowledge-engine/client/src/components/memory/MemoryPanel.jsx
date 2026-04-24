import { useState, useEffect } from "react";
import memoryStore from "../../store/memoryStore";
import { fetchMemories } from "../../services/api";
import { formatDate, truncateText } from "../../utils/helpers";

const MemoryPanel = () => {
  const [memories, setMemories] = useState(memoryStore.getQueries());
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMemories = async () => {
      try {
        const data = await fetchMemories();
        memoryStore.setQueries(data.queries || []);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to load memory");
      }
    };

    const unsubscribe = memoryStore.subscribe((queries) => {
      setMemories(queries);
    });

    void loadMemories();

    return unsubscribe;
  }, []);

  return (
    <div className="memory-panel">
      {error ? <div className="memory-empty">{error}</div> : null}
      <div className="memories-list">
        {memories.length ? (
          memories.slice(0, 5).map((memory) => (
            <div key={memory.id || memory.createdAt} className="memory-item">
              <div className="memory-question">{memory.question}</div>
              <div className="memory-answer">
                {truncateText(memory.answer || "", 120)}
              </div>
              <div className="memory-time">
                {memory.createdAt ? formatDate(memory.createdAt) : "Just now"}
              </div>
            </div>
          ))
        ) : (
          <div className="memory-empty">
            Your recent questions will appear here after you start chatting.
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryPanel;
