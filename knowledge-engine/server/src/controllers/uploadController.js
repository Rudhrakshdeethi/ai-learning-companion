import { processPDF } from "../services/ingestionService.js";
import { formatServiceError } from "../utils/serviceError.js";

export const uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a PDF file." });
    }

    const result = await processPDF(req.file);

    res.json({
      message: "PDF processed successfully",
      ...result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: formatServiceError(err, "Upload failed"),
    });
  }
};
