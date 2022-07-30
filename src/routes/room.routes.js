const express = require('express');

const roomCtrl = require('./../controllers/room.controller');

const router = express.Router();

router.route('/api/rooms')
  .post(roomCtrl.create);

router.route('/api/rooms/:roomId')
  .get(roomCtrl.login)
  .delete(roomCtrl.remove);

router.param('roomId', roomCtrl.roomById);

module.exports = router;
