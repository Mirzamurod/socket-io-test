const BaseError = require('../errors/base.error')

module.exports = function (err, req, res, next) {
  if (err instanceof BaseError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors, success: false })
  }
  return res.status(400).json({ message: err.message, success: false })
}
