import express from "express"
import { register,verification } from "../controllers/auth.controller.js";
import { registerMiddleware, } from "../middleware/auth.middleware.js"

const app = express.Router();

app.post("/register",registerMiddleware,register)
app.post("/verified",verification)

export default app