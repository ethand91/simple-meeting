class Room {
  constructor () {
    this.users = new Set();
  }

  addUser (socketId) {
    this.users.add(socketId);
  }

  removeUser (socketId) {
    this.users.delete(socketId);
  }

  count () {
    return this.users.size;
  }
}

module.exports = Room
