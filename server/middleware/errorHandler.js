// Error handler middleware placeholder

function errorHandler(err, req, res, next) {
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: 'Validation Error', errors: err.errors });
  }
  // Express-validator error (already handled in validate.js, but fallback)
  if (err.array) {
    return res.status(400).json({ message: 'Validation Error', errors: err.array() });
  }
  // Custom error
  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }
  // Default to 500
  res.status(500).json({ message: 'Server Error', error: err.message });
}

module.exports = errorHandler;
