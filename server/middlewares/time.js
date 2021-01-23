const timeMiddleWare = (req, res, next) => {
  req.requestTime = Date.now()

  next()
}

module.exports = timeMiddleWare
