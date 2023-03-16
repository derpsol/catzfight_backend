const express = require('express');
const { Joi } = require('express-validation');
const nftCtrl = require('./nft.controller');
const { validate } = require('../../helpers');

const router = express.Router();

router.route('/ids')
    .get(nftCtrl.findIds);

router.route('/urls')
  .get(nftCtrl.findUrls)

module.exports = router;