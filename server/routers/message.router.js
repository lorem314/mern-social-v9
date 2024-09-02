import express from "express"

import authCtrl from "../controllers/auth.controller"
import messageCtrl from "../controllers/message.controller"

const router = express.Router()

router
  .route("/api/messages")
  .post(authCtrl.requireLogin, authCtrl.hasAuthorization, messageCtrl.create)

export default router
