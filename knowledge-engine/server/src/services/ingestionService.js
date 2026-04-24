import fs from "fs/promises";

import Document from "../models/Document.js";
import { addPdfJob } from "../../../worker/jobs/processPdf.job.js";

export const processPDF = async (file) => {
  if (!file) {
    throw new Error("No file uploaded");
  }

  const doc = await Document.create({
    filename: file.originalname,
  });

  try {
    const result = await addPdfJob(file.path, doc._id);

    return {
      docId: doc._id.toString(),
      filename: doc.filename,
      ...result,
    };
  } catch (error) {
    await Document.findByIdAndDelete(doc._id).catch(() => null);
    throw error;
  } finally {
    await fs.unlink(file.path).catch(() => null);
  }
};
