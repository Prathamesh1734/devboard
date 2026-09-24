const ErrorResponse = require("../utils/errorResponse");

const validate = (schema) => {
  return (req, res, next) => {
    try {
      // 1. Safety check: Did we accidentally pass undefined instead of a schema?
      if (!schema) {
        console.error(
          "[Zod Error] Schema is undefined. Check your route imports!",
        );
        return next(new ErrorResponse("Server configuration error", 500));
      }
      //parse() throws an error if validation fails
      console.log("HEADERS:", req.headers["content-type"]);
      console.log("BODY:", req.body);
      schema.parse(req.body);
      next();
    } catch (error) {
      // 2. Safety check: Is this a Zod validation error?
      if (error.errors) {
        const errorMessage = error.errors
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(", ");
        return next(new ErrorResponse(errorMessage, 400));
      }

      // 3. If it's a standard code error, pass it to the global error handler
      next(error);
    }
  };
};

module.exports = validate;
