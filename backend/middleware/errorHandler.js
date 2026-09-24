function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "internal server error";

  console.log(`[Error] ${err.name}: ${err.message}`);

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}

module.exports = errorHandler;
