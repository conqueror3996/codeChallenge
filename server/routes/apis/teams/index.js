const express = require('express')
const path = require('path')
const fs = require('fs')
const db = require('../../../services/db')
const {environment} = require('../../../environments/index')

const teamRouter = express.Router()


module.exports = teamRouter
