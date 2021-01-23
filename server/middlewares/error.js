const errorMiddleWare = (err, req, res, next) => {
  return res.status(500).send('Something broke !')
}

module.exports = errorMiddleWare
