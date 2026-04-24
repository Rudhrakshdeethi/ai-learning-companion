const listeners = new Set();

const workspaceStore = {
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  notify() {
    listeners.forEach((listener) => listener());
  },
};

export default workspaceStore;
