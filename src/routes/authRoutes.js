const express = require("express");
const {
  RegisterUser,
  verifyEmail,
  loginUser,
  refreshAccessToken,
} = require("../controller/authController");
const {
  loginRateLimit,
  registerRateLimit,
  refreshRateLimit,
} = require("../middleware/rateLimitMiddleware");

const router = express.Router();

router.post("/register", registerRateLimit, RegisterUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", loginRateLimit, loginUser);
router.post("/refresh", refreshRateLimit, refreshAccessToken);

module.exports = router;
