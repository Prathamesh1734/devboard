const ErrorResponse = require("../utils/errorResponse");
const Job = require("../models/Job");
const asyncHandler = require("../utils/asyncHandler");

// let jobs = [
//   { id: "1", title: "Frontend Developer", company: "TechCorp", status: "open" },
//   {
//     id: "2",
//     title: "Backend Node Developer",
//     company: "StartupInc",
//     status: "closed",
//   },
// ];

// @desc    Get all jobs
// @route   GET /api/jobs
const getJobs = asyncHandler(async (req, res, next) => {
  // try {
  //   const jobs = await Job.find();
  //   return res
  //     .status(200)
  //     .json({ success: true, count: jobs.length, data: jobs });
  // } catch (error) {
  //   next(error);
  // }

  // 1. Copy req.query (e.g., { status: 'open', sort: 'title', page: '2' })
  let query;
  const reqQuery = { ...req.body };

  // 2. Fields to exclude from standard filtering
  // We delete these from reqQuery so Mongoose doesn't try to match them against database fields
  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach((param) => delete reqQuery[param]);

  // 3. Create query string
  let queryStr = JSON.stringify(reqQuery);

  // 4. Create operators ($gt,$gte, etc)
  // This lets users filter like: /api/jobs?salary[gte]=100000 (if you had a salary field)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`,
  );

  // 5. Initialize the base query
  query = Job.find(JSON.parse(queryStr));

  // 6. SORTING logic
  if (req.query.sort) {
    // Mongoose expects spaces instead of commas: 'title company'
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    // Default sort by newest first
    query = query.sort("-createdAt");
  }

  // 7. PAGINATION logic
  // Default to page 1, limit 10 per page
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit; // How many documents to skip

  // Add populate to the query chain
  // The second argument 'name email' tells it to ONLY return those fields, not the password/role
  query = query.skip(skip).limit(limit).populate("employer", "name email");

  // 8. Execute the fully constructed query!
  const jobs = await query;

  // 9. Create pagination meta data (helps frontend know if there is a Next or Prev page)
  const total = await Job.countDocuments(JSON.parse(queryStr));
  const pagination = {};

  if (skip + limit < total) {
    pagination.next = { page: page + 1, limit };
  }
  if (skip > 0) {
    pagination.prev = { page: page - 1, limit };
  }

  return res
    .status(200)
    .json({ success: true, count: jobs.length, pagination, data: jobs });
});

// @desc    Get single job
// @route   GET /api/jobs/:id
const getJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id).populate(
    "employer",
    "name email",
  );
  if (!job) {
    // return res.status(404).json({ success: false, message: "job not found" });
    return next(
      new ErrorResponse(`job not found with id of ${req.params.id}`, 404),
    );
  }
  return res.status(200).json({ success: true, data: job });
});

// @desc    Create new job
// @route   POST /api/jobs
const createJob = asyncHandler(async (req, res, next) => {
  // Hardcoded dummy user ID to satisfy the 'employer' requirement in our schema
  req.body.employer = "60d0fe4f5311236168a109ca";
  const job = await Job.create(req.body);
  return res.status(201).json({ success: true, data: job });
});

// @desc    Update job
// @route   PUT /api/jobs/:id
const updateJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Returns the updated document instead of the original
    runValidators: true, // Ensures the update follows Mongoose schema rules
  });
  if (!job) {
    return next(
      new ErrorResponse(`job not found with id ${req.params.id}`, 404),
    );
  }
  return res.status(200).json({ success: true, data: job });
});

// @desc    Delete job
// @route   DELETE /api/jobs/:id
const deleteJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findByIdAndDelete(req.params.id);
  if (!job) {
    return next(
      new ErrorResponse(`job not found with id ${req.params.id}`, 404),
    );
  }
  return res.status(200).json({ success: true, data: {} });
});

module.exports = { getJob, getJobs, updateJob, deleteJob, createJob };
