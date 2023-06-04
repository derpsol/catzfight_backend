const userInfo = require('./userinfo.model');

async function list(req, res, next) {
  try {
    const userinfos = await userInfo.list();

    return res.json(userinfos);
  } catch (error) {
    return next(error);
  }
}

async function find(req, res, next) {
  const user = req.query;
  try {
    const foundUser = await userInfo.findOne({ address: user.address }).exec();
    return res.json(foundUser);
  } catch (error) {
    return next(error);
  }
}

async function create(req, res, next) {
  // eslint-disable-next-line new-cap
  const userinfo = new userInfo(req.body);
  try {
    const findUser = await userInfo
      .findOne({ address: userinfo.address })
      .exec();
    if (findUser) {
      if (userinfo.claimAmount === -1) {
        findUser.claimAmount = 0;
      } else {
        findUser.claimAmount = userinfo.claimAmount + findUser.claimAmount;
      }
      if (userinfo.ownIds[0] === -1) {
        findUser.ownIds = [];
        findUser.ownAddress = [];
      } else if (userinfo.ownIds === []) {
        findUser.ownIds = [...findUser.ownIds];
        findUser.ownAddress = [...findUser.ownAddress];
      } else {
        findUser.ownIds = [...findUser.ownIds, ...userinfo.ownIds];
        findUser.ownAddress = [...findUser.ownAddress, ...userinfo.ownAddress];
      }
      findUser.stakeAmount = userinfo.stakeAmount + findUser.stakeAmount;
      const saveUserInfo = await findUser.save();
      return res.json(saveUserInfo);
    }
    const savedUserInfo = await userinfo.save();
    return res.json(savedUserInfo);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create,
  list,
  find,
};
