const { string } = require("joi");
const mongoose = require("mongoose");

const RandomSchema = new mongoose.Schema({
  address: {
    type: String,
    require: true
  },
  stakeAmount: {
    type: Numebr,
    require: false
  },
  claimAmount: {
    type: Number,
    require: false
  },
  ownNfts: {
    type: Number[0],
    require: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

RandomSchema.method({});

RandomSchema.statics = {
  async get(id) {
    const book = await this.findById(id).populate("owner").exec();
    if (!book) {
      throw new APIError("No such room exists!", httpStatus.NOT_FOUND);
    }
    return book;
  },

  list() {
    return this.find().populate("owner").exec();
  },

  listLazy({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("owner")
      .exec();
  },
};

module.exports = mongoose.model("Random", RandomSchema);
