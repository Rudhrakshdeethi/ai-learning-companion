import mongoose from "mongoose";

const querySchema = new mongoose.Schema({
  question: String,
  answer: String,
  chunksUsed: [mongoose.Schema.Types.ObjectId],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Query", querySchema);
