'use strict'
const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const filepath = path.join(__dirname, '../data/scoreboard.json')
let scoreboard

app.use((req, res, next) => {
  fs.readFile(filepath, 'utf8', (err, data) => {
    if (err) console.warn('Failed to read file')
    else scoreboard = JSON.parse(data)
    if (req.method !== 'GET') {
      const fin = res.end
      res.end = function () {
        fs.writeFileSync(
          filepath,
          JSON.stringify(scoreboard, null, '  ')
        )
        return fin.apply(this, arguments)
      }
    }
    next()
  })
})

app.use(express.static('public'))
app.use(bodyParser.json())

app.get('/scores', (req, res) => {
  res.json(scoreboard)
})

app.get('/scores/:id', (req, res) => {
  const score = scoreboard[req.params.id]
  res.json(score)
})

// create
app.post('/scores', (req, res) => {
  const score = req.body
  scoreboard.push(score)
  res.json(score)
})

// update
app.put('/scores/:id', (req, res) => {
  scoreboard[req.params.id] = req.body
  res.json(scoreboard[req.params.id])
})

// delete
app.delete('/scores/:id', (req, res) => {
  delete scoreboard[req.params.id]
  res.send(scoreboard)
})

module.exports = app
