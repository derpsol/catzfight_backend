const httpStatus = require('http-status');
const Betting = require('./betting.model');
const APIError = require('../../helpers/APIError');

async function load(req, res, next, id) {
  try {
    const book = await Betting.get(id);
    req.book = book;
    return next();
  } catch (error) {
    return next(error);
  }
}

function get(req, res) {
  const betting = Betting.find();
  return res.json(betting);
}

async function create(req, res, next) {
  const room = new Betting(req.query);
  try {
    const savedRoom = await room.save();
    return res.json(savedRoom);
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  const room = req.query;
  try {
    const foundRoom = await Betting.findOne({ roomnum : room.roomnum }).exec();
    if(foundRoom.secondNFT) return next(new APIError(httpStatus.BAD_REQUEST, "Player already exists"));
    foundRoom.secondNFT = room.secondNFT;
    foundRoom.secondaddress = room.secondaddress;
    foundRoom.secondRandom = room.secondRandom;
    const savedRoom = await foundRoom.save();
    return res.json(savedRoom);
  } catch (error) {
    return next(error);
  }
}

async function find(req, res, next) {
  const room = req.query;
  try {
    const foundRoom = await Betting.findOne({ fightRoom : room.fightRoom }).exec();
    return res.json(foundRoom);
  } catch (error) {
    return next(error);
  }
}

async function list(req, res, next) {
  try {
    const bettings = await Betting.list();
    return res.json(bettings);
  } catch (error) {
    return next(error);
  }
}

async function socketlist() {
  try {
    const bettings = await Betting.list();
    return bettings;
  } catch (error) {
    return error;
  }
}

async function remove(req, res, next) {
  const roomnum = req.params.roomnum;
  try {
    const deletedRoom = await Betting.remove({roomnum: roomnum});
    return res.json(deletedRoom);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  load,
  get,
  create,
  update,
  list,
  remove,
  find,
  socketlist,
};
