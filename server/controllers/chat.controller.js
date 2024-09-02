import fs from "fs"
import mongoose from "mongoose"

import User from "../models/user.model"
import Chat from "../models/chat.model"
import redis from "../redis"

const listByUser = async (req, res) => {
  const userId = req.payload?.auth?.user._id
  try {
    const chats = await Chat.aggregate([
      {
        $match: { users: { $elemMatch: { $in: [userId, "$users"] } } },
      },
      {
        $addFields: {
          withUser: {
            $filter: {
              input: "$users",
              as: "user",
              cond: { $ne: ["$$user", { $toObjectId: userId }] },
            },
          },
        },
      },
      { $unwind: "$withUser" },
      {
        $replaceWith: { $unsetField: { field: "users", input: "$$ROOT" } },
      },
      {
        $lookup: {
          from: "users",
          localField: "withUser",
          foreignField: "_id",
          as: "withUser",
        },
      },
      { $unwind: "$withUser" },
      {
        $lookup: {
          from: "UserViewChat",
          let: { chatId: "$_id", userId: "$withUser._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: [
                        { $toObjectId: "$userId" },
                        { $toObjectId: "$$userId" },
                      ],
                    },
                    {
                      $eq: [
                        { $toObjectId: "$chatId" },
                        { $toObjectId: "$$chatId" },
                      ],
                    },
                  ],
                },
              },
            },
            { $project: { _id: 0, date: 1 } },
          ],
          as: "lastView",
        },
      },
      { $unwind: "$lastView" },
      {
        $lookup: {
          from: "messages",
          let: { chatId: "$_id", lastView: "$lastView.date" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: [
                        { $toObjectId: "$fromChat" },
                        { $toObjectId: "$$chatId" },
                      ],
                    },
                    { $lte: ["$$lastView", "$createdAt"] },
                  ],
                },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "createdBy",
              },
            },
            { $unwind: "$createdBy" },
            {
              $project: {
                text: 1,
                "createdBy._id": 1,
                "createdBy.name": 1,
                createdAt: 1,
              },
            },
          ],
          as: "messages",
        },
      },
      {
        $project: {
          type: 1,
          "withUser._id": 1,
          "withUser.name": 1,
          messages: 1,
          messages2: 1,
          lastView: 1,
        },
      },
    ]).exec()

    const user = await User.findById(userId, "following")
    const followedUsers = user.following.map((u) => u.toString())
    console.log("followedUsers", followedUsers)

    // check if the user chat with is online
    for (let i = 0; i <= chats.length - 1; i++) {
      const uid = chats[i].withUser._id.toString()
      const sid = await redis.hGet("uid2sid", uid)
      console.log("sid", sid)
      if (followedUsers.includes(uid)) {
        if (sid) chats[i].isOnline = true
        else chats[i].isOnline = false
      } else {
        chats[i].isOnline = null
      }
    }
    console.log("chats", chats)

    return res.json({ ...req.payload, chats })
  } catch (error) {
    console.error(error)
    return res.status(400).json({ error: "获取消息失败" })
  }
}

export default { listByUser }
