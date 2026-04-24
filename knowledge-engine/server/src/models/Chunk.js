import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema({
  text: String,
  documentId: mongoose.Schema.Types.ObjectId,
  embedding: [Number],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Chunk", chunkSchema);
