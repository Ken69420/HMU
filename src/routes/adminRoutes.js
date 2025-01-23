const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controller/superAdminController");

const router = express.Router();

//Admin route
router.get(
  "/admin",
  authenticateToken,
  roleMiddleware(["Admin", "Super Admin"]),
  (req, res) => {
    res.json({ message: "Welcome Admin" });
  }
);

router.post(
  "/users",
  authenticateToken,
  roleMiddleware(["Super Admin"]),
  createUser
);
router.get(
  "/users",
  authenticateToken,
  roleMiddleware(["Super Admin"]),
  getAllUsers
);
router.put(
  "/users/:userId",
  authenticateToken,
  roleMiddleware(["Super Admin"]),
  updateUser
);
router.delete(
  "/users/:userId",
  authenticateToken,
  roleMiddleware(["Super Admin"]),
  deleteUser
);

module.exports = router;
