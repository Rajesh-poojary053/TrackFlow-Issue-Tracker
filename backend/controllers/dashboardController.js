const Issue = require("../models/Issue");

const getDashboardStats = async (req, res) => {
  try {
    // Admin can see all issues.
    // Regular users can see issues they created or were assigned.
    const filter =
      req.user.role === "admin"
        ? {}
        : {
            $or: [
              { createdBy: req.user._id },
              { assignedTo: req.user._id },
            ],
          };

    const [total, open, inProgress, closed] = await Promise.all([
      Issue.countDocuments(filter),
      Issue.countDocuments({ ...filter, status: "Open" }),
      Issue.countDocuments({ ...filter, status: "In Progress" }),
      Issue.countDocuments({ ...filter, status: "Closed" }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total,
        open,
        inProgress,
        closed,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getDashboardStats };