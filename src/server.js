const app = require('./express');
const socket = require('./socket');

const connection = require('./db/pscale');

try {
  connection.connect();
  console.log('database connection established');

  app.listen(3001, error => {
    if (error) {
      console.error(error);
      process.exit(1);
    }

    console.log('express started on port 3001');
  });

  socket.listen(3002, error => {
    if (error) {
      console.error(error);
      process.exit(1);
    }

    console.log('socket started on port 3002');
  });
} catch (error) {
  console.error('app failed to start', error);
  process.exit(1);
}
