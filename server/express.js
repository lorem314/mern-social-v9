import path from "path"
import express from "express"
import React from "react"
import { renderToString } from "react-dom/server"
import { StaticRouter } from "react-router-dom/server"

// 3rd middleware
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import compression from "compression"
import helmet from "helmet"
import cors from "cors"
import favicon from "serve-favicon"
//
import userRouter from "./routers/user.router"
import authRouter from "./routers/auth.router"
import messageRouter from "./routers/message.router"
//
import MainRouter from "../client/MainRouter"
import htmlIndex from "./templates/html-index"

// dev env only
import devBundle from "./devBundle"
// dev env only

const CURRENT_WORKING_DIR = process.cwd()

const app = express()
// dev env only
devBundle.compile(app)
// dev env only

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compression())
app.use(helmet())
app.use(cors())

app.use("/dist", express.static(path.join(CURRENT_WORKING_DIR, "dist")))
app.use(favicon(path.join(CURRENT_WORKING_DIR, "public", "favicon.ico")))

app.use("/", userRouter)
app.use("/", authRouter)
app.use("/", messageRouter)

app.use("*", async (req, res) => {
  const context = {}
  console.log("[express.js] req.originalUrl:", req.originalUrl)
  try {
    const markup = renderToString(
      <StaticRouter location={req.originalUrl} context={context}>
        <MainRouter />
      </StaticRouter>
    )
    if (context.url) return res.redirect(303, context.originalUrl)

    return res.status(200).send(htmlIndex({ markup }))
  } catch (error) {
    console.error("[express.js] use* :", error)
  }
})

app.use((error, req, res, next) => {
  console.log("[express.js] catch error middleware")
  if (error.name === "UnauthorizedError") {
    return res.status(401).json({ error: "refreshToken 已过期" })
  } else if (error) {
    return res.status(400).json({ error: error.name + ": " + error.message })
  }
})

export default app
