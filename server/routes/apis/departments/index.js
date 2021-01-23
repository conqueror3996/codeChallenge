const express = require('express')
const path = require('path')
const fs = require('fs')
const db = require('../../../services/db')
const {environment} = require('../../../environments/index')

const departmentRouter = express.Router()


module.exports = departmentRouter
