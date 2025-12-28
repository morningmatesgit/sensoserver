const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  updatePushToken,
  logout,
  googleMobileLogin,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");

/* =============================================
   AUTH ROUTES
============================================= */

router.post("/register", register);
router.post("/login", login);
router.post("/google/mobile-login", googleMobileLogin);
router.get("/me", verifyToken, getMe);
router.put("/profile", verifyToken, updateProfile);
router.put("/push-token", verifyToken, updatePushToken);
router.post("/logout", verifyToken, logout);

// Password Reset Routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
