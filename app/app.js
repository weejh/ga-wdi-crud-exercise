'use strict'
const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
mongoose.Promise = Promise
const app = express()

const dbUri = 'mongodb://' +
  process.env.MONGODB_USER + ':' + process.env.MONGODB_PASSWORD +
  '@ds061984.mongolab.com:61984/playground'
mongoose.connect(dbUri)

var Score = mongoose.model('Score', {
  player: String,
  score: Number
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
  const score = new Score(req.body)
  score.save(err => {
    if (err) return console.error(err)
    res.json(req.body)
    console.log('score saved!')
  })
})

// update
app.put('/scores/:player', (req, res) => {
  const query = { player: req.params.player }
  // Callback style:
  Score.findOneAndUpdate(query, req.body, { new: true }, (err, score) => {
    if (err) {
      console.error(err)
      res.status(500).end(err)
    } else if (score) {
      console.log('found and updated', JSON.stringify(score))
      res.json(score)
    } else {
      console.log('not found')
      res.status(404).end('Score Not Found')
    }
  // Promise style:
  // Score.findOneAndUpdate(query, req.body, { new: true })
  //   .then(score => {
  //     if (score) {
  //       console.log('found and updated', JSON.stringify(score))
  //       res.json(score)
  //     } else {
  //       console.log('not found')
  //       res.status(404).end('Score Not Found')
  //     }
  //   })
  //   .catch(err => {
  //     console.error(err)
  //     res.status(500).end(err)
  //   })
})

// delete
app.delete('/scores/:name', (req, res) => {
  delete scoreboard[req.params.id]
  res.send(scoreboard)
})

module.exports = app
