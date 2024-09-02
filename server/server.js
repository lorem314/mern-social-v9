import { networkInterfaces } from "os"
import mongoose from "mongoose"

import app from "./express"
import server from "./socket"
import redis from "./redis"
import config from "../config/config"

mongoose.Promise = global.Promise
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
})
mongoose.connection.on("error", (error) => {
  console.log("Error :", error)
  console.error(`[ERROR] 无法连接到 MongoDB: ${config.mongoUri}`)
  throw new Error(`[ERROR] 无法连接到 MongoDB: ${config.mongoUri}`)
})
mongoose.connection.on("connected", () => {
  console.info(`[>>>>] 成功连接到 MongoDB`)
  console.log("")
})
redis.connect()

server.listen(config.port, (error) => {
  if (error) {
    console.error("[server.js]", error)
  } else {
    const nets = networkInterfaces()
    const ip = nets["wlan0"][0].address
    console.log("")
    console.info(`[>>>>] 成功开启服务器`)
    console.info(`[>>>>] 本地 http://localhost:${config.port}`)
    console.info(`[>>>>] 网络 http://${ip}:${config.port}`)
  }
})
