
const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Issue title is required"],
      trim: true,
      maxlength: 150
    },

    description: {
      type: String,
      required: [true, "Issue description is required"],
      trim: true
    },

    status: {
      type: String,
      enum: ["Open", "In Progress", "Closed"],
      default: "Open"
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Issue", issueSchema);
