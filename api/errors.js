const { ValidationError } = require("jsonschema");

class AppError extends Error {
  constructor(message, status) {
    super(message);

    this.status = status;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const catchAsync = fn => (req, res, next) => {
  fn(req, res, next).catch(next);
};

function custom404(req, res, next) {
  next(
    new AppError(
      `${req.method} on ${req.originalUrl} is not a valid request.`,
      404
    )
  );
}

function errorHandling(error, req, res, next) {
  console.error(error);
  //handle ValidationErrors, which are sent as an array
  if (error[0] instanceof ValidationError) {
    const message = error.map(e => e.stack.replace(/"/g, "'"));
    return res.status(400).json({ message });
  }
  //handle ordinary errors
  const { status = 500, message = "Error" } = error;
  res.status(status).json({ message });
}

module.exports = { AppError, catchAsync, custom404, errorHandling };
