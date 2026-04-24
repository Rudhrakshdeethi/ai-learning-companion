const CHAT_STORAGE_KEY = "knowledge-engine-chat-messages";
const MAX_MESSAGES = 40;

const listeners = new Set();

const readStoredMessages = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CHAT_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to restore chat history", error);
    return [];
  }
};

let messages = readStoredMessages();

const notify = () => {
  listeners.forEach((listener) => listener(messages));
};

const persist = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
};

const chatStore = {
  getMessages() {
    return messages;
  },

  setMessages(nextMessages) {
    messages = nextMessages.slice(-MAX_MESSAGES);
    persist();
    notify();
  },

  addMessage(message) {
    messages = [...messages, message].slice(-MAX_MESSAGES);
    persist();
    notify();
  },

  clear() {
    messages = [];
    persist();
    notify();
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export default chatStore;
