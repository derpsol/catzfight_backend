const userInfo = require('./userinfo.model');

async function list(req, res, next) {
  try {
    const userinfos = await userInfo.find().limit(10).sort({ createdAt: -1 });

    return res.json(userinfos);
  } catch (error) {
    return next(error);
  }
}

function get(req, res) {
  const userinfo = userInfo.find();
  return res.json(userinfo);
}

async function create(req, res, next) {
  const userinfo = new userInfo(req.query);
  try {
    const savedUserInfo = await userinfo.save();
    return res.json(savedUserInfo);
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  const userinfo = new userInfo(req.query);
  try {
    const findUser = await userInfo.findOne({address: userinfo.address}).exec();
    findUser.stakeAmount = userinfo.stakeAmount;
    findUser.claimAmount = userinfo.claimAmount;
    findUser.ownNfts = userinfo.ownNfts;
    const saveUserInfo = await findUser.save();
    return res.json(saveUserInfo);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  get,
  create,
  list,
  update,
};
