
const Issue = require("../models/Issue");
const User = require("../models/User");
const Comment = require("../models/Comment");

// CREATE ISSUE
exports.createIssue = async (req, res) => {
  try {
    const { title, description, priority, assignedTo } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required"
      });
    }

    // Only admin can assign an issue
    let assignee = null;

    if (req.user.role === "admin" && assignedTo) {
      assignee = await User.findById(assignedTo);

      if (!assignee) {
        return res.status(404).json({
          success: false,
          message: "Assigned user not found"
        });
      }
    }

    const issue = await Issue.create({
      title,
      description,
      priority: priority || "Medium",
      createdBy: req.user._id,
      assignedTo: assignee ? assignee._id : null
    });

    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      issue
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL ISSUES
exports.getIssues = async (req, res) => {
  try {
    const filter = req.user.role === "admin"
      ? {}
      : {
          $or: [
            { createdBy: req.user._id },
            { assignedTo: req.user._id }
          ]
        };

    const issues = await Issue.find(filter)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: issues.length,
      issues
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET SINGLE ISSUE
exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found"
      });
    }

    const isOwner =
      issue.createdBy._id.toString() === req.user._id.toString();

    const isAssignee =
      issue.assignedTo &&
      issue.assignedTo._id.toString() === req.user._id.toString();

    if (req.user.role !== "admin" && !isOwner && !isAssignee) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    res.status(200).json({
      success: true,
      issue
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE ISSUE
exports.updateIssue = async (req, res) => {
  try {
    const { title, description, status, priority, assignedTo } = req.body;

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found"
      });
    }

    const userId = req.user._id.toString();

    const isAdmin = req.user.role === "admin";
    const isOwner = issue.createdBy.toString() === userId;
    const isAssignee = issue.assignedTo &&
      issue.assignedTo.toString() === userId;

    // Only admin, creator or assigned user can update
    if (!isAdmin && !isOwner && !isAssignee) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    // Validate status
    const validStatuses = ["Open", "In Progress", "Closed"];

    if (status !== undefined && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue status"
      });
    }

    // Admin and creator can edit issue details
    if (isAdmin || isOwner) {
      if (title !== undefined) issue.title = title;
      if (description !== undefined) issue.description = description;
      if (priority !== undefined) issue.priority = priority;
    }

    // Admin, creator and assigned user can change status
    if (status !== undefined) {
      issue.status = status;
    }

    // Only admin can assign or reassign issues
    if (assignedTo !== undefined) {
      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Only admin can assign issues"
        });
      }

      if (assignedTo === null || assignedTo === "") {
        issue.assignedTo = null;
      } else {
        const assignee = await User.findById(assignedTo);

        if (!assignee) {
          return res.status(404).json({
            success: false,
            message: "Assigned user not found"
          });
        }

        issue.assignedTo = assignee._id;
      }
    }

    await issue.save();

    const updatedIssue = await Issue.findById(issue._id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      issue: updatedIssue
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE ISSUE
exports.deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found"
      });
    }

    const isOwner =
      issue.createdBy.toString() === req.user._id.toString();

    if (req.user.role !== "admin" && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "Only the creator or admin can delete this issue"
      });
    }

    await Comment.deleteMany({ issue: issue._id });
    await issue.deleteOne();

    res.status(200).json({
      success: true,
      message: "Issue deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
