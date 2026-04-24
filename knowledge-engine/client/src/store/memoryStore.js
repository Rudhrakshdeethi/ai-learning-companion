// Simple in-memory store for client-side state
const memoryStore = {
  queries: [],
  listeners: new Set(),

  addQuery(query) {
    this.queries = [query, ...this.queries].slice(0, 10);
    this.listeners.forEach((listener) => listener(this.queries));
  },

  setQueries(queries) {
    this.queries = queries;
    this.listeners.forEach((listener) => listener(this.queries));
  },

  getQueries() {
    return this.queries;
  },

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },

  clear() {
    this.queries = [];
    this.listeners.forEach((listener) => listener(this.queries));
  },
};

export default memoryStore;
