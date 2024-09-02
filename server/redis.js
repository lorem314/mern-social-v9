import { createClient } from "redis"

const client = createClient(6379, "127.0.0.1")

client.on("error", (error) => {
  console.error("[ERROR] 无法连接到 Redis :", error)
})

client.on("connect", () => {
  console.log("[>>>>] 成功连接到 Redis ")
})

export default client
