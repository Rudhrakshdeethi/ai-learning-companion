export const createChunkObject = ({ text, embedding, documentId }) => {
  return {
    text,
    embedding,
    documentId,
    createdAt: new Date(),
  };
};
