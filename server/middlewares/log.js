const fs = require('fs')

const writeAPIAccessLog = (logObject) => {
  const text = `Date: ${logObject.date}\nAPIName: ${logObject.apiName}\nIP: ${logObject.ip}\n\n`
  if (!fs.existsSync('./logs/api-access/api-access.txt')) {
    fs.mkdirSync('logs')
    fs.mkdirSync('logs/api-access')
  }

  fs.appendFileSync('logs/api-access/api-access.txt', text)
}

const logMiddleWare = (req, res, next) => {
  const date = new Date().toLocaleString()
  const apiName = req.url
  const ip = req.headers.origin || req.ip
  writeAPIAccessLog({ date, apiName, ip })

  next()
}

module.exports = logMiddleWare
