const express = require("express");
const router = express.Router();

const {
  addComment,
  getComments,
} = require("../controllers/commentController");

const { protect } = require("../middleware/authMiddleware");

// All comment routes require login
router.use(protect);

// Add a comment and get comments for an issue
router.route("/:id")
  .post(addComment)
  .get(getComments);

module.exports = router;