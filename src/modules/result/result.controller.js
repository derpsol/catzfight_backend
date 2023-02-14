const Result = require('./result.model');

async function list(req, res, next) {
  try {
    const results = await Result.list();
    return res.json(results);
  } catch (error) {
    return next(error);
  }
}

function get(req, res) {
  const result = Result.find();
  return res.json(result);
}

async function create(req, res, next) {
  const result = new Result(req.query);
  try {
    const savedResult = await result.save();
    return res.json(savedResult);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  get,
  create,
  list,
};
