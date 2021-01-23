const express = require('express')

const apiRouter = express.Router()
const authenRouter = require('./apis/authentication')

const departmentRouter = require('./apis/departments')
const teamRouter = require('./apis/teams')
const employeeRouter = require('./apis/employees')

const middleWares = require('../middlewares')

apiRouter.use('/authen', authenRouter)

apiRouter.use('/*', middleWares.permissionsMiddleWare.authenMiddleware)

apiRouter.use('/departments', departmentRouter)
apiRouter.use('/teams', teamRouter)
apiRouter.use('/employees', employeeRouter)

module.exports = apiRouter
