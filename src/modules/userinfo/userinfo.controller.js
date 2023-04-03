const userInfo = require("./userinfo.model");

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
    const foundUser = await userInfo.findOne({ address : user.address }).exec();
    return res.json(foundUser);
  } catch (error) {
    return next(error);
  }
}

async function create(req, res, next) {
  const userinfo = new userInfo(req.query);
  try {
    console.log(JSON.parse(userinfo.ownNfts));
    userinfo.ownNfts = JSON.parse(userinfo.ownNfts)
    const findUser = await userInfo
      .findOne({ address: userinfo.address })
      .exec();
    if (findUser) {
      if(userinfo.claimAmount == -1) {
        findUser.claimAmount = 0;
      } else {
        findUser.claimAmount = userinfo.claimAmount + findUser.claimAmount;
      }
      if(userinfo.ownNfts[0] == -1) {
        findUser.ownNfts = [];
      } else if(userinfo.ownNfts == []) {
        findUser.ownNfts =Array.from(new Set([...findUser.ownNfts]));
      } else {
        findUser.ownNfts =Array.from(new Set([...findUser.ownNfts, ...userinfo.ownNfts]));
      }
      findUser.stakeAmount = userinfo.stakeAmount + findUser.stakeAmount;
      const saveUserInfo = await findUser.save();
      return res.json(saveUserInfo);
    } else {
      const savedUserInfo = await userinfo.save();
      return res.json(savedUserInfo);
    }
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create,
  list,
  find,
};
