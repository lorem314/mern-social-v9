import fs from "fs"
import mongoose from "mongoose"
import formidable from "formidable"
import extend from "lodash/extend"

import User from "../models/user.model"
import Chat from "../models/chat.model"
import Message from "../models/message.model"
import UserViewChat from "../models/user-view-chat.model"
import userDefaultAvatar from "../../assets/images/user-default-avatar.png"

const create = async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    return res.status(200).json({ message: "成功注册帐号" })
  } catch (error) {
    console.error("[userCtrl] create", error)
    return res.status(400).json({ error: "无法创建用户" })
  }
}

const read = async (req, res) => {
  const {
    params: { userId },
    query: { requesterId },
  } = req

  try {
    const user = await User.findById(userId, "_id name email about").exec()
    const result = await User.aggregate([
      { $match: { $expr: { $eq: ["$_id", { $toObjectId: userId }] } } },
      {
        $project: {
          followingCount: { $size: "$following" },
          followersCount: { $size: "$followers" },
          isFollowing: {
            $cond: {
              if: requesterId !== "",
              then: {
                $in: [
                  {
                    $convert: {
                      input: requesterId,
                      to: "objectId",
                      onError: "",
                      onNull: "",
                    },
                  },
                  "$followers",
                ],
              },
              else: false,
            },
          },
        },
      },
    ]).exec()
    const { followingCount, followersCount, isFollowing } = result[0]

    return res.json({
      user,
      followingCount,
      followersCount,
      isFollowing,
    })
  } catch (error) {
    return res.json({ error: error.toString() })
  }
}

const list = async (req, res) => {
  try {
    const users = await User.find({}, "_id name email about").exec()
    return res.json({ users })
  } catch (error) {
    console.error("[userCtrl] list", error)
    return res.status(400).json({ error: "无法获取所有用户信息" })
  }
}

const follow = async (req, res) => {
  console.log("follow Transaction")

  const userId = req.params.userId
  const followId = req.body.followId

  let session = null
  try {
    session = await mongoose.startSession()
    session.startTransaction()

    await User.findByIdAndUpdate(
      userId,
      { $push: { following: followId } },
      { session }
    )

    await User.findByIdAndUpdate(
      followId,
      { $push: { followers: userId } },
      { session }
    )

    const hasChat = await Chat.findOne({ users: { $all: [userId, followId] } })
    if (!hasChat) {
      console.log("[userCtrl] follow: no chat, create")

      const [chat] = await Chat.create([{ users: [userId, followId] }], {
        session,
      })
      console.log("[userCtrl] follow after create chat", chat)

      await UserViewChat.create([{ userId: userId, chatId: chat._id }], {
        session,
      })
      console.log("[userCtrl] follow after create userViewChat for userId")

      await UserViewChat.create([{ userId: followId, chatId: chat._id }], {
        session,
      })
      console.log("[userCtrl] follow after create userViewChat for followId")

      const message = await Message.create(
        [{ text: "我关注了你", createdBy: userId, fromChat: chat._id }],
        { session }
      )
      console.log("[userCtrl] follow after create auto message")
    }

    await session.commitTransaction()
    session.endSession()

    const aggr = await User.aggregate([
      { $match: { $expr: { $eq: ["$_id", { $toObjectId: followId }] } } },
      {
        $project: {
          followersCount: { $size: "$followers" },
          isFollowing: {
            $in: [
              { $convert: { input: userId, to: "objectId", onError: "" } },
              "$followers",
            ],
          },
        },
      },
    ]).exec()
    const { followersCount, isFollowing } = aggr[0]
    console.log("aggrUser", { followersCount, isFollowing })

    return res.json({ followersCount, isFollowing })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    console.error("[userCtrl] follow", error)
    return res.status(400).json({ error: error.toString() })
  }
}

const unfollow = async (req, res) => {
  console.log("unfollow Transaction")

  const userId = req.params.userId
  const unfollowId = req.body.unfollowId
  try {
    const session = await User.startSession()
    session.startTransaction()

    await User.findByIdAndUpdate(
      userId,
      { $pull: { following: unfollowId } },
      { session }
    )

    await User.findByIdAndUpdate(
      unfollowId,
      { $pull: { followers: userId } },
      { session }
    )

    await session.commitTransaction()
    session.endSession()

    const aggrUser = await User.aggregate([
      { $match: { $expr: { $eq: ["$_id", { $toObjectId: unfollowId }] } } },
      {
        $project: {
          followersCount: { $size: "$followers" },
          isFollowing: {
            $in: [
              { $convert: { input: userId, to: "objectId", onError: "" } },
              "$followers",
            ],
          },
        },
      },
    ]).exec()
    const { followersCount, isFollowing } = aggrUser[0]
    console.log("aggrUser", { followersCount, isFollowing })

    return res.json({ followersCount, isFollowing })
  } catch (error) {
    console.error("[userCtrl] unfollow", error)
    return res.status(400).json({ error: error.toString() })
  }
}

const update = async (req, res) => {
  const userId = req.params.userId
  const form = formidable({ keepExtensions: true, multiples: false })
  try {
    const [fields, files] = await form.parse(req)
    const user = await User.findById(userId).select("name about")
    const extendedUser = extend(
      user,
      Object.entries(fields).reduce(
        (obj, [key, value]) => ({ ...obj, [key]: value[0] }),
        {}
      )
    )

    if (files.avatar) {
      const avatarFile = files.avatar[0]
      extendedUser.avatar.data = fs.readFileSync(avatarFile.filepath)
      extendedUser.avatar.contentType = avatarFile.mimetype
    }

    const updatedUser = await extendedUser.save()
    const { _id, name, about } = updatedUser

    return res.json({ user: { name, about } })
  } catch (error) {
    return res
      .status(400)
      .json({ error: "无法更新用户信息", errString: error.toString() })
  }
}

const avatar = async (req, res, next) => {
  const userId = req.params.userId
  if (!userId) return next()
  try {
    const user = await User.findById(userId, "_id avatar").exec()
    if (!user.avatar.contentType) return next()
    res.set("Content-Type", user.avatar.contentType)
    return res.send(user.avatar.data)
  } catch (error) {
    console.error("[userCtrl] avatar", error.toString())
    return res.sendFile(process.cwd() + userDefaultAvatar)
  }
}

const defaultAvatar = async (_req, res) => {
  return res.sendFile(process.cwd() + userDefaultAvatar)
}

export default {
  create,
  read,
  list,
  follow,
  unfollow,
  update,
  avatar,
  defaultAvatar,
}
