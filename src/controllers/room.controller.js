const { v4: uuidv4 } = require('uuid');

const connection = require('./../db/pscale');

const create = async (req, res) => {
  try {
    const key = uuidv4();

    await connection.promise().query('INSERT INTO room (`key`) VALUES (?)', [key]);

    return res.status(200).json({ key });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'failed to create room' });
  }
};

const login = async (req, res) => {
  try {
    return res.status(200);
  } catch (error) {
    console.error(error);
  }
};

const remove = async (req, res) => {
  try {
    const room = req.room;

    await connection.promise().query(`delete from room where id=${room.id}`);

    return res.status(200);
  } catch (error) {
    return res.status(400).json({ error: 'failed to delete room' });
  }
};

const roomById = async (req, res, next, key) => {
  try {
    const result = await connection.promise().query('SELECT * FROM room WHERE room.`key` = ? limit 1', [key]);

    if (!result[0][0]) throw new Error('room not found');

    req.room = result[0][0];
    next();
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error: 'room could not be found' });
  }
};

module.exports = {
  create,
  login,
  remove,
  roomById
};
