const Approved = require('./approved.model');

async function list(req, res, next) {
  try {
    const randoms = await Approved.find();

    return res.json(randoms);
  } catch (error) {
    return next(error);
  }
}

function get(req, res) {
  const approved = Approved.find();
  return res.json(approved);
}

async function create(req, res, next) {
  const approved = new Approved(req.body);
  try {
    const savedApproved = await approved.save();

    return res.json(savedApproved);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  get,
  create,
  list,
};