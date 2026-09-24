const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeUrl: {
      type: String,
      required: [true, "provide resume url"],
    },
    status: {
      type: String,
      enum: ["applied", "reviewing", "interviewing", "rejected", "hired"],
      default: "applied",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Application", applicationSchema);
