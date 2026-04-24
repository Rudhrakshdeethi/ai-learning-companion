import {
  normalizeText,
  splitTextIntoChunks,
} from "../../shared/utils/textUtils.js";

export const chunkText = (text) => {
  if (!text) {
    return [];
  }

  return splitTextIntoChunks(normalizeText(text)).filter(Boolean);
};
