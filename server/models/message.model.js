import mongoose from "mongoose"

const MessageSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    createdBy: { type: mongoose.Schema.ObjectId, ref: "User" },
    fromChat: { type: mongoose.Schema.ObjectId, ref: "Chat" },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

export default mongoose.model("Message", MessageSchema)
