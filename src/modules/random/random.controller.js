const { address } = require('../../server');
const Random = require('./random.model');

async function list(req, res, next) {
  try {
    const randoms = await Random.find().limit(10).sort({ createdAt: -1 });

    return res.json(randoms);
  } catch (error) {
    return next(error);
  }
}

function get(req, res) {
  const random = Random.find();
  return res.json(random);
}

async function create(req, res, next) {
  const random = new Random(req.query);
  try {
    const savedRandom = await random.save();
    return res.json(savedRandom);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  get,
  create,
  list,
};
