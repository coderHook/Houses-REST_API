const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 4000

const Sequelize = require('sequelize')
const sequelize = new Sequelize('postgres://postgres:secret@localhost:5432/postgres', {define: { timestamps: false }})

app.use(bodyParser.json())

//Defining the houses model with sequalize.
const House = sequelize.define('house', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  size: Sequelize.INTEGER,
  price: Sequelize.INTEGER
}, {
  tableName: 'houses'
})


House.sync() //this creates the houses table in the database when app starts.

app.get('/houses', function (req, res, next) {
  House.findAll()
    .then(houses => {
      res.json({ houses: houses })
    })
    .catch(err => {
      res.status(500).json({
        message: 'Something went wrong',
        error: err
      })
    })
})

app.get('/houses/:id', function(req, res, next) {
  const id = req.params.id

  House.findByPk(id)
    .then(house => {
      res.json({house})
    })
    .catch(err => {
      res.status(500).json({
        message: 'Something went wrong',
        error: err
      })
    })
})

app.post('/houses', function(req, res) {
  House
    .create(req.body)
    .then(house => res.status(201).json(house))
    .catch(err => res.status(500).json(err))
})

app.put('/houses/:id', function(req, res) {
  const id = req.params.id

  House.findByPk(id)
    .then( house => {
        house
        .update(req.body)
        .then(house => res.status(200).json(house).send(house))
 
    })
    .catch(err => res.status(500).json(err))
});

app.delete('/houses/:id', (req, res) => {
  const id = req.params.id

  House.destroy({
    where: {id}
  })
  .then(deleteHouse => {
    res.status(200).json(deleteHouse)
  })
  .catch(err => res.status(500).json(err))
})

app.listen(port, () => `Listening on port ${port}`);