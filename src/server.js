const app = require('./express');
const socket = require('./socket')(app);

const connection = require('./db/pscale');

const PORT = process.env.PORT || 3000;

try {
  connection.connect();
  console.log('database connection established');

  app.listen(PORT, error => {
    if (error) {
      console.error(error);
      process.exit(1);
    }

    console.log(`server started on port ${PORT}`);
  });
} catch (error) {
  console.error('app failed to start', error);
  process.exit(1);
}
