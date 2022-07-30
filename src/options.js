const fs = require('fs');

const options = {
  key: fs.readFileSync('./src/ssl/server.key'),
  cert: fs.readFileSync('./src/ssl/server.crt')
};

module.exports = options;
