const permissionsMiddleWare = require('./permissions')
const errorMiddleWare = require('./error')
const timeMiddleWare = require('./time')
const logMiddleWare = require('./log')

module.exports = {
  permissionsMiddleWare,
  errorMiddleWare,
  timeMiddleWare,
  logMiddleWare,
}
