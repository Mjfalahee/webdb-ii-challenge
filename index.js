const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection:  {
    filename: './data/lambda.db3'
  }
};

const db = knex(knexConfig);


const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here


//select * from zoos
server.get('/api/zoos', (req, res) => {
  db('zoos')
    .then(zoos => {
      res.status(200).json(zoos);
    })
    .catch(error => {
      res.status(500).json({
        message: 'Error retrieving zoos.'
      });
    })
});

//select * from zoos where id = id
server.get('/api/zoos/:id', (req, res) => {
  db('zoos')
    .where({id: req.params.id})
    .first()
    .then(zoo => {
      if (zoo) {
        res.status(200).json(zoo);
      } else {
        res.status(404).json({
          message: 'No zoo with that ID found.'
        })
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Error while searching for zoo with that ID.'
      });
    })
});

//insert data
server.post('/api/zoos', (req, res) => {
  if (req.body.name.length > 0) {
    db('zoos', 'id')
    .insert(req.body)
    .then(ids => {
      const[id] = ids;
      db('zoos')
      .where({ id })
      .first()
      .then(zoo => {
        res.status(200).json(zoo);
      })
    })
    .catch(error => {
      res.status(500).json({
        message: 'Error while adding the zoo to the database.'
      });
    })
  }
  else {
    res.status(400).json({
      message: 'Please include a name for your zoo.'
    })
  }
})

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
