const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "add title"],
      trim: true,
      maxlength: [100, "cannot be more than 100 characters"],
    },
    company: { type: String, required: [true, "add company"] },
    // 1. EMBEDDED RELATIONSHIP: Location details live directly inside the Job document
    location: {
      city: String,
      state: String,
      remote: { type: Boolean, default: false },
    },
    status: {
      type: String,
      enum: ["open", "closed", "interviewing"],
      default: "open",
    },
    // 2. REFERENCED RELATIONSHIP: Points to a separate User document
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Job", JobSchema);
