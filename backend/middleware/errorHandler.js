/**
 * 404 Handler for undefined routes
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found`,
    data: null
  });
};

/**
 * Centralized error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('[Error Details]:', err.name, err.message);

  // Mongoose CastError (e.g. bad ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: `Invalid ${err.path}: ${err.value}`,
      data: null
    });
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      message: messages.join('. '),
      data: { errors: messages }
    });
  }

  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      message: `Duplicate value for field: ${field}. Must be unique.`,
      data: null
    });
  }

  // Fallback internal server error
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    data: null
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
