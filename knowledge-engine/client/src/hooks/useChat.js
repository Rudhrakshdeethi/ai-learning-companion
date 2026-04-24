import { useEffect, useState } from "react";
import { askQuestion } from "../services/api";
import chatStore from "../store/chatStore";
import memoryStore from "../store/memoryStore";
import workspaceStore from "../store/workspaceStore";

export default function useChat() {
  const [messages, setMessages] = useState(chatStore.getMessages());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return chatStore.subscribe((nextMessages) => {
      setMessages(nextMessages);
    });
  }, []);

  const sendMessage = async (question) => {
    if (!question.trim()) return;

    const userMsg = { role: "user", text: question };
    chatStore.addMessage(userMsg);

    setLoading(true);

    try {
      const res = await askQuestion(question);

      const aiMsg = {
        role: "ai",
        text: res?.answer || "No response",
        sources: res?.sources || [],
      };

      chatStore.addMessage(aiMsg);

      memoryStore.addQuery({
        question,
        answer: aiMsg.text,
        createdAt: new Date().toISOString(),
      });

      workspaceStore.notify();
    } catch (err) {
      console.error(err);

      chatStore.addMessage({
        role: "ai",
        text:
          err.message || "I couldn't process that request. Please try again.",
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading };
}
