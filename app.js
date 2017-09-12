const express = require('express');
const cors= require('express-cors');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
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
app.get("/whatup", function(req, res) {
  res.send("whatup");
});

http.createServer(app).listen(app.get("port"), function() {
  console.log("Express server listening on port " + app.get("port"));
});



app.post('/api/v1/users', (request, response) => {
  database('users').where({
    email: request.body.email,
    password: request.body.password
  }).select()
    .then((users) => {
      response.status(200).json(users);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

module.exports = app;
