const Comment = require("../models/Comment");
const Issue = require("../models/Issue");

const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { id } = req.params;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be empty",
      });
    }

    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    const isAllowed =
      req.user.role === "admin" ||
      issue.createdBy.toString() === req.user._id.toString() ||
      (issue.assignedTo &&
        issue.assignedTo.toString() === req.user._id.toString());

    if (!isAllowed) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to comment on this issue",
      });
    }

    const comment = await Comment.create({
      issue: id,
      user: req.user._id,
      text: text.trim(),
    });

    await comment.populate("user", "name email");

    res.status(201).json({
      success: true,
      comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getComments = async (req, res) => {
  try {
    const { id } = req.params;

    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    const isAllowed =
      req.user.role === "admin" ||
      issue.createdBy.toString() === req.user._id.toString() ||
      (issue.assignedTo &&
        issue.assignedTo.toString() === req.user._id.toString());

    if (!isAllowed) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view these comments",
      });
    }

    const comments = await Comment.find({ issue: id })
      .populate("user", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { addComment, getComments };