import { getRelevantContext } from "../services/contextService.js";
import { rankChunks } from "../services/rankingService.js";
import { formatServiceError } from "../utils/serviceError.js";

import { generateAnswer } from "../../../ai-engine/reasoning/llmService.js";
import Query from "../models/Query.js";

export const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question?.trim()) {
      return res.status(400).json({ error: "Question is required." });
    }

    let chunks = await getRelevantContext(question);

    chunks = rankChunks(chunks);

    if (!chunks.length) {
      const answer = "Not found in documents.";

      await Query.create({
        question,
        answer,
        chunksUsed: [],
      });

      return res.json({
        answer,
        sources: [],
      });
    }

    const answer = await generateAnswer(question, chunks);

    await Query.create({
      question,
      answer,
      chunksUsed: chunks.map((c) => c._id),
    });

    res.json({
      answer,
      sources: chunks.map((c) => ({
        id: c._id?.toString?.() ?? String(c._id),
        text: c.text,
        score: c.score,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: formatServiceError(err, "Query failed"),
    });
  }
};
