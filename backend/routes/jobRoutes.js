const express = require("express");
const {
  getJob,
  getJobs,
  updateJob,
  deleteJob,
  createJob,
} = require("../controllers/jobController");
const validate = require("../middleware/validate");
const {
  createJobSchema,
  updateJobSchema,
} = require("../validations/jobValidation");

const router = express.Router();

// Grouping routes by the base URL path
router.route("/").get(getJobs).post(validate(createJobSchema), createJob);
// the validate middleware runs first. if it passes, createJob runs

// Grouping routes that require an ID parameter
router
  .route("/:id")
  .get(getJob)
  .put(validate(updateJobSchema), updateJob)
  .delete(deleteJob);

module.exports = router;
