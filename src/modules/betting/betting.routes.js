const express = require('express');
const bettingCtrl = require('./betting.controller');

const router = express.Router();

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
