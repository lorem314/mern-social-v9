import express from "express"

import authCtrl from "../controllers/auth.controller"
import chatCtrl from "../controllers/chat.controller"

const router = express.Router()

router.route("/auth/login").post(authCtrl.login, chatCtrl.listByUser)

router.route("/auth/auto-login").post(authCtrl.autoLogin, chatCtrl.listByUser)

router.route("/auth/logout").post(authCtrl.logout)

router.route("/auth/refresh").post(authCtrl.refreshAccessToken)

export default router
