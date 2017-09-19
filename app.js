const express = require('express');
const cors= require('express-cors');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);


const index = require('./routes/index');
const users = require('./routes/users');

const app = express();

app.use(cors());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
//parse incoming request data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', users);

app.set("port", process.env.PORT || 3000);

app.get("/", function(req, res) {
  res.send("war eagle!");
});

app.set("port", process.env.PORT || 3000);

http.createServer(app).listen(app.get("port"), function() {
  console.log("Express server listening on port " + app.get("port"));
});


// login of user
app.post('/api/v1/users', (request, response) => {
  request.body.email = request.body.email.toLowerCase()
  database('users').where({
    email: request.body.email,
    password: request.body.password
  }).select()
    .then((users) => {
      if(!users.length) {
        return response.status(400).json({ error: 'Invalid email or password' })
      }
      response.status(200).json(users);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

// create new account
app.post('/api/v1/users/new', (request, response) => {
  request.body.email = request.body.email.toLowerCase()
  database('users').insert({
    name: request.body.name,
    email: request.body.email,
    password: request.body.password
  }, '*')
  .then((users) => {
    response.status(200).json(users);
  })
  .catch((error) => {
    response.status(500).json({ error });
  })
})

// storing the test id in results database, use foreign key to connect to correct user
app.post('/api/v1/results', (request, response) => {
  database('results').insert({
    test_id: request.body.test_id,
    deck_id: request.body.deck_id,
    user_id: request.body.user_id
  }, '*')
  .then((results) => {
    response.status(200).json(results);
  })
  .catch((error) => {
    response.status(500).json({ error })
  })
})

// retrieve test_id for user_id
app.get('/api/v1/results/:id', (request, response) => {
  database('results').where({
    user_id: parseInt(request.params.id)
  }).select()
  .then((userResults) => {
    response.status(200).json(userResults);
  })
  .catch((error) => {
    response.status(500).json({ error });
  });
})

module.exports = app;
