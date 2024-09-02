import jwt from "jsonwebtoken"
import { expressjwt } from "express-jwt"

import User from "../models/user.model"
import config from "../../config/config"

const login = async (req, res, next) => {
  const { email, password, rememberMe } = req.body
  try {
    const user = await User.where({ email }).findOne()
    if (!user) return res.status(404).json({ error: "邮箱未被注册" })

    if (!user.authenticate(password))
      return res.status(403).json({ error: "密码不正确" })

    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken(rememberMe)

    // secure set to false will cause Chrome browser not to clear cookie after
    // page refresh, but will get cleared after browser closed
    const options = { secure: false, httpOnly: true }
    if (rememberMe) options.maxAge = 1000 * 60 * 60 * 24 * 2

    res.cookie("refreshToken", refreshToken, options)

    req.payload = {
      auth: {
        user: { _id: user._id, name: user.name, email: user.email },
        token: accessToken,
      },
      message: "登录成功",
    }
    next()
    // return res.json({
    //   auth: {
    //     user: { _id: user._id, name: user.name, email: user.email },
    //     token: accessToken,
    //   },
    // })
  } catch (error) {
    return res
      .status(400)
      .json({ error: "无法登录", errorString: error.toString() })
  }
}

const autoLogin = async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken
  try {
    if (refreshToken) {
      const { _id, iat } = jwt.verify(refreshToken, config.refresh_secret)
      console.log("[authCtrl] autoLogin, verified", { _id, iat })
      // console.log("iat", new Date(iat * 1000))
      const user = await User.findById(_id, "name email tokens").exec()
      if (user.tokens.includes(refreshToken)) {
        // console.log("has tokens")
        const accessToken = await user.generateAccessToken()
        // console.log("gen acc tkn", accessToken)
        req.payload = {
          auth: {
            user: { _id: user._id, name: user.name, email: user.email },
            token: accessToken,
          },
          message: "成功自动登录",
        }
        next()
        // return res.json({
        //   auth: {
        //     user: { _id: user._id, name: user.name, email: user.email },
        //     token: accessToken,
        //   },
        //   message: "成功自动登录",
        // })
      } else {
        return res.json({
          auth: null,
          message: "解析的 refreshToken 不属于该用户",
        })
      }
    } else {
      return res.json({ auth: null, message: "没有 refreshToken 无法自动登录" })
    }
  } catch (error) {
    return res.json({ auth: null, message: "自动登录出错" })
  }
}

const logout = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken
  if (refreshToken) {
    try {
      const { _id } = jwt.verify(refreshToken, config.refresh_secret)
      const user = await User.findById(_id, "tokens").exec()
      if (!user) {
        return res.json({ error: "找不到 refreshToken 中 _id 所对应的用户" })
      }
      if (!user.tokens.includes(refreshToken)) {
        return res.json({ error: "refreshToken 不属于其中 _id 所对应的用户" })
      }

      user.tokens = user.tokens.filter((token) => token !== refreshToken)
      await user.save()

      res.clearCookie("refreshToken")
      return res.json({ message: "成功登出" })
    } catch (error) {
      return res.json({ error: "refreshToken 解析错误" })
    }
  } else {
    return res.json({ error: "没有 refreshToken 无法登出" })
  }
}

const requireLogin = expressjwt({
  secret: config.access_secret,
  userProperty: "auth",
  algorithms: ["HS256"],
})

const hasAuthorization = async (req, res, next) => {
  const userId = req.params.userId
  const authedUserId = req.auth._id
  console.log("[hasAuthorization] user.name", req.auth.name)
  if (!userId == authedUserId) {
    return res.status("403").json({ error: "用户没有权限" })
  }
  next()
}

const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken
  if (!refreshToken) {
    return res
      .status(400)
      .json({ error: "[refreshAccessToken] cookie 中没有 refreshToken" })
  }

  try {
    const { _id } = jwt.verify(refreshToken, config.refresh_secret)
    const user = await User.findById(_id, "email name tokens").exec()
    if (!user.tokens.includes(refreshToken)) {
      return res
        .status(400)
        .json({ error: "[refreshAccessToken] 该用户没有对应的 refreshToken" })
    }
    const accessToken = await user.generateAccessToken()
    return res.json({
      auth: { _id: user._id, name: user.name, email: user.email },
      token: accessToken,
    })
  } catch (error) {
    return res.status(400).json({ error: "refreshToken 验证失败" })
  }
}

export default {
  login,
  autoLogin,
  logout,
  requireLogin,
  hasAuthorization,
  refreshAccessToken,
}
