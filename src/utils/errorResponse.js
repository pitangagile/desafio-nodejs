module.exports = (message = "Undefined internal error", code = 500) => ({
  message: message,
  errorCode: code
});