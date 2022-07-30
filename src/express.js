const express = require('express');
const path = require('path');
const https = require('https');
const bodyParser = require('body-parser');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');

const options = require('./options');
const roomRoutes = require('./routes/room.routes');

const app = express();

app.use(express.static(path.join(__dirname, "app/build")));

app.use(bodyParser.json());
app.use(compress());
app.use(helmet());
app.use(cors());

app.use('/', roomRoutes);

const server = https.createServer(options, app);

module.exports = server;
