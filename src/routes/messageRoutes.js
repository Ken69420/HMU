const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  sendMessages,
  receiveMessages,
} = require("../controller/messageController");

const router = express.Router();

//Send and receive message
router.post(
  "/messages",
  authenticateToken,
  roleMiddleware(["Normal User", "Admin", "Super Admin"]),
  sendMessages
);
router.get(
  "/messages",
  authenticateToken,
  roleMiddleware(["Normal User", "Admin", "Super Admin"]),
  receiveMessages
);

module.exports = router;
