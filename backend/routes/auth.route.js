import express from "express";
import {
  login,
  logout,
  register,
  verification,
  forgotPassword,
  verifyOtp,
} from "../controllers/auth.controller.js";
import {
  isLoggedIn,
  loginMiddleware,
  registerMiddleware,
  verifyOtpMiddleware,
} from "../middleware/auth.middleware.js";

const app = express.Router();

app.post("/register", registerMiddleware, register);
app.post("/verified", verification);
app.post("/login", loginMiddleware, login);
app.get("/logout", isLoggedIn, logout);
app.post("/forgot", forgotPassword);
app.post("/verify-otp",verifyOtpMiddleware,verifyOtp)

export default app;
