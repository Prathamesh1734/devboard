// This is a higher-order function that takes your controller function, executes it, and catches any errors.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
