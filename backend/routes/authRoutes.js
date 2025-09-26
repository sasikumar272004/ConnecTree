const express = require("express");
const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Public routes - Add multer middleware for image upload
router.post("/register", upload.single('profilePhoto'), authController.registerUser);
router.post("/login", authController.loginUser);

// Protected routes
router.post("/logout", protect, authController.logoutUser);
router.get("/profile", protect, authController.getProfile);

module.exports = router;