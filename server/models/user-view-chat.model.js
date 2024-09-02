import mongoose from "mongoose"

const UserViewChatSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    chatId: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
  },
  {
    collection: "UserViewChat",
  }
)

export default mongoose.model("UserViewChat", UserViewChatSchema)
