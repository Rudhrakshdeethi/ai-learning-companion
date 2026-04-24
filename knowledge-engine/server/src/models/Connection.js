import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({
  chunkA: mongoose.Schema.Types.ObjectId,
  chunkB: mongoose.Schema.Types.ObjectId,
  strength: Number,
});

export default mongoose.model("Connection", connectionSchema);
