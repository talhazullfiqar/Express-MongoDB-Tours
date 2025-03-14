function globalErrorHandler(err, req, res, next) {
  console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Server Error";
  res.status(err.statusCode).json({ status: err.status, message: err.message });
}

exports.globalErrorHandler = globalErrorHandler;
