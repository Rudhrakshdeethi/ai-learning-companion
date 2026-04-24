export const CHUNK_SIZE = 1200;
export const CHUNK_OVERLAP = 180;
export const MAX_CONTEXT_CHUNKS = 5;
export const MIN_CONTEXT_SCORE = 0.2;
export const CONNECTION_SIMILARITY_THRESHOLD = 0.78;
export const CONNECTION_LOOKAHEAD = 8;
export const MAX_CONNECTIONS_PER_CHUNK = 3;

export const JOB_TYPES = {
  PDF_PROCESS: "PDF_PROCESS",
};

export const STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  DONE: "done",
  FAILED: "failed",
};
