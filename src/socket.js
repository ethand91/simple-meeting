const socket = require('socket.io');
const https = require('https');

const options = require('./options');
const Room = require('./room');

const server = https.createServer(options);

const io = socket(server, {
  cors: {
    origin: '*'
  }
});

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('new connection', socket.id);

  socket.on('message', data => {
    socket.broadcast.emit('message', data);
  });

  socket.on('init', roomKey => {
    socket.roomKey = roomKey;

    if (!rooms.has(roomKey)) {
      const room = new Room();
      room.addUser(socket.id);
      rooms.set(roomKey, room);

      console.log('new room created');

      return;
    }

    if (rooms.get(roomKey) === socket.id) return;

    if (Array.from(rooms.values()).length === 2) {
      socket.disconnect();

      return;
    }

    const room = rooms.get(roomKey);
    room.addUser(socket.id);
    socket.broadcast.emit('offer');
  });

  socket.once('disconnect', () => {
    console.log('disconnect', socket.roomKey);
    if (rooms.has(socket.roomKey)) {
      const room = rooms.get(socket.roomKey);

      room.removeUser(socket.id);

      if (room.count() === 0) {
        rooms.delete(socket.roomKey);

        console.log('room was deleted', socket.roomKey);
      }
    }
  });

  socket.once('error', error => {
    console.error(error);
  });
});

module.exports = server;
