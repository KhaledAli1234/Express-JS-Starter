export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export const successResponse = ({
  status = 200,
  res,
  message = "Done",
  data = {},
} = {}) => {
  return res.status(status).json({
    message,
    data,
  });
};

export const globalErrorHandling = (error, req, res, next) => {
  return res.status(error.cause || 500).json({
    error_message: error.message,
    error,
    stack: process.env.MOOD === "DEV" ? error.stack : undefined,
  });
};
