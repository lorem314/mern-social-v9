import express from "express"

import authCtrl from "../controllers/auth.controller"
import userCtrl from "../controllers/user.controller"

const router = express.Router()

router.route("/api/users").post(userCtrl.create).get(userCtrl.list)

router
  .route("/api/users/:userId/follow")
  .put(authCtrl.requireLogin, authCtrl.hasAuthorization, userCtrl.follow)
router
  .route("/api/users/:userId/unfollow")
  .put(authCtrl.requireLogin, authCtrl.hasAuthorization, userCtrl.unfollow)

router
  .route("/api/users/:userId")
  .get(userCtrl.read)
  .put(authCtrl.requireLogin, authCtrl.hasAuthorization, userCtrl.update)

router.route("/api/users/default/avatar").get(userCtrl.defaultAvatar)
router
  .route("/api/users/:userId/avatar")
  .get(userCtrl.avatar, userCtrl.defaultAvatar)

export default router
