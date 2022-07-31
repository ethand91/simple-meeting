const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');

const options = require('./options');
const roomRoutes = require('./routes/room.routes');

const app = express();

app.use(express.static(path.join(__dirname, "./../app/build")));

app.use(bodyParser.json());
app.use(compress());
app.use(helmet());
app.use(cors());

app.use('/', roomRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + './../app/build/index.html'));
});

const server = http.createServer(app);

module.exports = server;
