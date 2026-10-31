
const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  adminLogin,
  getAllUsers,
} = require("../controllers/authController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

// User registration
router.post("/register", registerUser);

// User login
router.post("/login", loginUser);

// Admin login
router.post("/admin/login", adminLogin);

// Verify logged-in user
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      _id: req.user._id,
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

// Get all registered users (Admin only)
router.get("/users", protect, adminOnly, getAllUsers);

module.exports = router;
