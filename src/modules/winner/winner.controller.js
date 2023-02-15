const Result = require('./winner.model');

async function list(req, res, next) {
  try {
    const results = await Result.find().limit(10).sort({winCount: -1});

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

async function update(req, res, next) {
  const winner = req.query;
  try {
    const foundWinner = await Result.findOne({ address : winner.address }).exec();
    foundWinner.winCount = winner.winCount;
    const savedWinner = await foundWinner.save();
    return res.json(savedWinner);
  } catch (error) {
    return next(error);
  }
}

async function findOne(req, res, next) {
  const winner = req.query;
  try {
    const foundWinner = await Result.findOne({ address : winner.address }).exec();
    return res.json(foundWinner);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  get,
  findOne,
  create,
  update,
  list,
};
