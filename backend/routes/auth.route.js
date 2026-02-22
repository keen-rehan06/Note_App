import express from "express"
import { login, logout, register,verification } from "../controllers/auth.controller.js";
import { isLoggedIn, loginMiddleware, registerMiddleware, } from "../middleware/auth.middleware.js"

const app = express.Router();

app.post("/register",registerMiddleware,register)
app.post("/verified",verification)
app.post("/login",loginMiddleware,login)
app.post("/logout",isLoggedIn,logout)
export default app