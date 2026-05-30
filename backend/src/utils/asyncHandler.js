/**
 * Wraps an async Express route handler to automatically catch
 * rejected promises and forward them to the error handler.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
