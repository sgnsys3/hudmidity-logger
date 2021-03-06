const express = require('express')
const bodyParser = require('body-parser')
const winston = require('winston')
const app = express()

const humidityLogger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      filename: '/var/log/iot/humidity.log',
      logstash: true,
      timestamp: () => {
        return new Date().getTime()
      }
    }),
  ],
})

app.use(bodyParser.json())


app.post('/data', (req, res) => {
  if (req.body.humidity === undefined || req.body.temperature === undefined || req.body.location === undefined) {
    res.send(JSON.stringify({
      error: 'Not enough Data',
    }))
  }
  req.body.type = 'humidity'
  humidityLogger.info(req.body)
  res.send(JSON.stringify(req.body))
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})