import crypto from "crypto"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"

import config from "../../config/config"

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: "缺少用户名" },
    email: {
      type: String,
      trim: true,
      unique: "邮箱已被注册",
      index: { unique: true },
      match: [/.+\@.+\..+/, "邮箱格式不正确"],
      required: "缺少邮箱地址",
    },
    about: { type: String, trim: true, default: "" },
    avatar: { data: Buffer, contentType: String },
    following: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    hashed_password: { type: String, required: "缺少密码" },
    salt: String,
    tokens: [String],
  },
  {
    timestamps: true,
  }
)

UserSchema.virtual("password")
  .set(function (password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function () {
    return this._password
  })

UserSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },
  encryptPassword: function (password) {
    if (!password) return ""
    try {
      return crypto.createHmac("sha1", this.salt).update(password).digest("hex")
    } catch (err) {
      console.error("[user.model] encryptPassword ")
      return ""
    }
  },
  makeSalt: () => Math.round(new Date().valueOf() * Math.random()) + "",
  generateAccessToken: async function () {
    const accessToken = jwt.sign(
      {
        _id: this._id.toString(),
        name: this.name,
        email: this.email,
      },
      config.access_secret,
      {
        expiresIn: config.access_expiry,
      }
    )
    return accessToken
  },
  generateRefreshToken: async function (rememberMe) {
    const options = {}
    if (rememberMe) options.expiresIn = config.refresh_expiry
    const refreshToken = jwt.sign(
      { _id: this._id.toString() },
      config.refresh_secret,
      options
    )
    this.tokens.push(refreshToken)
    await this.save()
    return refreshToken
  },
}

UserSchema.path("hashed_password").validate(function (v) {
  if (this._password && this.password.length < 6) {
    this.invalidate("password", "密码长度不能小于 6 位")
  }
  if (this.isNew && !this._password) {
    this.invalidate("password", "缺少密码")
  }
}, null)

export default mongoose.model("User", UserSchema)
