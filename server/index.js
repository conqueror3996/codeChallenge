const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const path = require('path')
const {environment, setEnv} = require('./environments/index')
const apiRouter = require('./routes/index')
const middleWares = require('./middlewares/index')

app.set('env', 'development')

// app.set('env', 'production')

app.set('trust proxy', true)

app.use(express.static(path.join(__dirname, '/public')))

app.use(express.static(path.join(__dirname, '/web')))

app.use(cors())

app.use(bodyParser.json())

app.use(middleWares.logMiddleWare)

app.use(middleWares.timeMiddleWare)

app.use('/api', apiRouter)

app.use(middleWares.errorMiddleWare)

app.get('/*', (req, res) =>
  res.sendFile(path.join(__dirname, '/web/index.html'))
)

app.get(/.*/, (req, res) =>
  res.status(404).json({
    msg: 404,
  })
)

const server = app.listen(environment.serverPort, '0.0.0.0', () => {
  console.log(`Server is listening ! with database ${environment.database.database}`)
})

module.exports = server
