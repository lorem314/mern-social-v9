import mongoose from "mongoose"

const ChatSchema = new mongoose.Schema({
  users: {
    type: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    index: true,
  },
})

export default mongoose.model("Chat", ChatSchema)
