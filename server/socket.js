import { createServer } from "http"
import { Server } from "socket.io"
import jwt from "jsonwebtoken"

import User from "./models/user.model"
import UserViewChat from "./models/user-view-chat.model"

import app from "./express"
import redis from "./redis"
import config from "../config/config"

const httpServer = createServer(app)

const io = new Server(httpServer)

app.set("sio", io)

io.on("connection", async (socket) => {
  const sid = socket.id
  // console.log(`[socket] sid ${sid} connected !!!!`)

  const rawCookie = socket.handshake?.headers?.cookie
  const cookie = parseRawCookie(rawCookie)
  // console.log("cookie", cookie)

  const { refreshToken } = cookie
  if (refreshToken) {
    try {
      const { _id: uid } = jwt.verify(refreshToken, config.refresh_secret)

      const user = await User.findById(uid, "name following").exec()
      console.log("[socket connection] user.following", user.following)
      user.following.forEach((followingId) => {
        const fid = followingId.toString()
        // console.log(`[socket connection] uid ${uid} join room ${fid}`)
        socket.join(`online_${fid}`)
      })
      socket
        .to(`online_${uid}`)
        .emit("user-online", { _id: uid, name: user.name, isOnline: true })

      console.log(`[socket] sid ${sid} of uid ${uid} connected !!!!`)
      redis.hSet("uid2sid", uid, sid)
      redis.hSet("sid2uid", sid, uid)

      socket.on("disconnect", () => {
        console.log(`[socket] sid ${sid} of uid ${uid} disconnected...`)
        socket.to(`online_${uid}`).emit("user-offline", {
          _id: uid,
          name: user.name,
          isOnline: false,
        })
        redis.hDel("uid2sid", uid)
        redis.hDel("sid2uid", sid)
      })

      socket.on("send-message", async ({ message, toUserId, chatId }) => {
        console.log("[server] send-message toUserId", toUserId)
        console.log("[server] send-message message", message)
        const sid = await redis.hGet("uid2sid", toUserId)
        console.log("[server] socket id", sid)
        socket.to(sid).emit("receive-message", { message, chatId })
      })

      socket.on("update-user-view-chat", async ({ userId, chatId }) => {
        console.log("[socket] update-user-view-chat")
        const updated = await UserViewChat.findOneAndUpdate(
          { userId, chatId },
          { date: Date.now() },
          { new: true }
        )
        console.log("[socket] updated", updated)
      })
    } catch (error) {
      console.error("[socket] verify refreshToken", error)
    }
  }
})

export default httpServer

const parseRawCookie = (rawCookie) =>
  !rawCookie
    ? {}
    : Object.fromEntries(
        rawCookie.split(";").map((pair) => pair.trim().split("="))
      )
