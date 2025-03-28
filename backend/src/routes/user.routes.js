import {Router} from "express"
import {getUserProfile, loginUser, logoutUser, refreshToken, registerUser} from "../controllers/user.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"
const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(authMiddleware,logoutUser)
router.route("/refreshToken").post(refreshToken)
router.route("/getUser").get(authMiddleware,getUserProfile)

export default router