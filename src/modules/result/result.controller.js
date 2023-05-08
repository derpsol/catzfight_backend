const Result = require('./result.model');

async function list(req, res, next) {
  try {
    const results = await Result.find().limit(3).sort({ roomNum: -1 });
    return res.json(results);
  } catch (error) {
    return next(error);
  }
}


async function create(req, res, next) {
  const result = new Result(req.body);
  try {
    const savedResult = await result.save();

    req.io.to("fightRoom").emit("savedResult", savedResult);

    return res.json(savedResult);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create,
  list,
};
