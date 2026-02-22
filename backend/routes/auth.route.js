import express from "express"
import { register } from "../controllers/auth.controller.js";
import { registerMiddleware } from "../middleware/auth.middleware.js"

const app = express.Router();

app.post("/register",registerMiddleware,register)

export default app