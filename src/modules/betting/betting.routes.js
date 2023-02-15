const express = require('express');
const { Joi } = require('express-validation');
const bettingCtrl = require('./betting.controller');
const { validate } = require('../../helpers');

const router = express.Router();

const paramValidation = {
  createRoom: {
    body: Joi.object({
      roomnum: Joi.number().required(),
      firstaddress: Joi.string().required(),
      firstNFT: Joi.string().required(),
    }),
  },
  updateRoom: {
    params: Joi.object({
      roomnum: Joi.number().required(),
    }),
    body: Joi.object({
      secondaddress: Joi.string().required(),
      secondNFT: Joi.string().required(),
    }),
  },
};

router.route('/')
  .get(bettingCtrl.list);

router.route('/find')
  .get(bettingCtrl.find);

router.route('/create')
  .post(
    // validate(paramValidation.createRoom), 
    bettingCtrl.create
    )

  .get(bettingCtrl.get)

router.route('/update')
  .post(
    // validate(paramValidation.updateRoom), 
    bettingCtrl.update)

router.route('/delete/:roomnum')
  .delete(bettingCtrl.remove);

router.param('bookId', bettingCtrl.load);

module.exports = router;
