import { CHUNK_OVERLAP, CHUNK_SIZE } from "../constants/system.js";

export const normalizeText = (text) =>
  text
    .replace(/\r/g, "\n")
    .replace(/\t/g, " ")
    .replace(/\u0000/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const splitParagraphs = (text) =>
  normalizeText(text)
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter(Boolean);

const splitLongSentence = (sentence) => {
  if (sentence.length <= CHUNK_SIZE) {
    return [sentence];
  }

  const words = sentence.split(/\s+/).filter(Boolean);
  const segments = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;

    if (next.length > CHUNK_SIZE && current) {
      segments.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) {
    segments.push(current);
  }

  return segments;
};

const splitSentences = (paragraph) =>
  paragraph
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'])/)
    .flatMap((sentence) => splitLongSentence(sentence.trim()))
    .filter(Boolean);

const takeOverlap = (chunk) => {
  if (!chunk || chunk.length <= CHUNK_OVERLAP) {
    return chunk;
  }

  const overlap = chunk.slice(-CHUNK_OVERLAP);
  const boundaryIndex = overlap.search(/[A-Z0-9"']/);

  return boundaryIndex > 0 ? overlap.slice(boundaryIndex).trim() : overlap.trim();
};

export const splitTextIntoChunks = (text) => {
  const paragraphs = splitParagraphs(text);

  if (!paragraphs.length) {
    return [];
  }

  const chunks = [];
  let currentChunk = "";

  for (const paragraph of paragraphs) {
    const sentences = splitSentences(paragraph);

    for (const sentence of sentences) {
      const nextChunk = currentChunk ? `${currentChunk} ${sentence}` : sentence;

      if (nextChunk.length <= CHUNK_SIZE) {
        currentChunk = nextChunk;
        continue;
      }

      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }

      const overlap = takeOverlap(currentChunk);
      currentChunk = overlap ? `${overlap} ${sentence}` : sentence;

      if (currentChunk.length > CHUNK_SIZE) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
      }
    }

    if (currentChunk && !/[.!?]$/.test(currentChunk)) {
      currentChunk = `${currentChunk}.`;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return [...new Set(chunks.map((chunk) => chunk.trim()).filter(Boolean))];
};
