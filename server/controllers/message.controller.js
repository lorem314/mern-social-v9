import mongoose from "mongoose"

import Message from "../models/message.model"
import Chat from "../models/chat.model"

const create = async (req, res) => {
  const { text, fromUserId, toUserId, chatId } = req.body
  console.log("message create", { text, fromUserId, toUserId, chatId })

  try {
    const message = new Message({
      text,
      createdBy: { _id: fromUserId },
      fromChat: { _id: chatId },
    })
    await message.save()
    await message.populate("createdBy", "name")

    return res.json({
      test: "ok",
      message: {
        _id: message._id,
        text: message.text,
        createdBy: message.createdBy,
        createdAt: message.createdAt,
      },
    })
  } catch (error) {
    console.error("[messageCtrl] create", error)
    return res.status(400).json({ error: error.toString() })
  }
}

export default { create }
