import {Router} from "express"
import { createTodo, getTodo, deleteTodo, updateTodo } from "../controllers/todo.controller.js"
import {authMiddleware} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/getTodo").get(authMiddleware, getTodo)

router.route("/createTodo").post(authMiddleware, createTodo)

router.route("/deleteTodo/:id").delete(authMiddleware, deleteTodo)
router.route("/updateTodo/:id").post(authMiddleware, updateTodo)

export default router