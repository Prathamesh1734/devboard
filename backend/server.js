const cookieParser = require("cookie-parser");
const express = require("express");
const dotenv = require("dotenv");
const jobRoutes = require("./routes/jobRoutes");
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

//load env variables
dotenv.config();

//connect to db
connectDB();

const app = express();

//to parse json bodies
app.use(express.json());
app.use(cookieParser());
// Mount routers
// This tells Express: "For any URL starting with /api/jobs, use the jobRoutes file"
app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);

//basic health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "success", message: "server is running" });
});

//Crucial rule: The error handler must be mounted after all your routes. If it's placed before them, it won't catch their errors.
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
