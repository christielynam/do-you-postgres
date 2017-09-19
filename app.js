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

// ENDPOINTS
// login user to database, retrieve user
app.post('/api/v1/users', (request, response) => {
  request.body.email = request.body.email.toLowerCase()
  const { email, password } = request.body

  database('users').where({ email, password }).select()
    .then((users) => {
      if(!users.length) {
        return response.status(404).json({ error: 'Invalid email or password' })
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
  const { name, email, password } = request.body

  if (!name || !email || !password) {
    return response.status(422).json({ error: 'Missing required information to complete request' })
  }

  database('users').insert({ name, email, password }, '*')
    .then((users) => {
      response.status(200).json(users);
    })
    .catch((error) => {
      response.status(500).json({ error });
    })
})

// storing the test id in results database
app.post('/api/v1/results', (request, response) => {
  const { test_id, deck_id, user_id } = request.body

  if (!test_id || !deck_id || !user_id) {
    return response.status(422).json({ error: 'Missing required information to complete request' })
  }

  database('results').insert({ test_id, deck_id, user_id }, '*')
    .then((results) => {
      response.status(200).json(results);
    })
    .catch((error) => {
      response.status(500).json({ error })
    })
})

// retrieve all tests for each user
app.get('/api/v1/results/:id', (request, response) => {

  database('results').where({
    user_id: parseInt(request.params.id)
  }).select()
    .then((userResults) => {
      if (!userResults.length) {
        return response.status(404).json({ error: 'No assessments for this user were found' })
      }
      response.status(200).json(userResults);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
})

module.exports = app;
