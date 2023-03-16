const express = require('express');
const userInfoCtrl = require('./userinfo.controller');

const router = express.Router();

router.route('/')
  .get(userInfoCtrl.list);

router.route('/create')
  .post(userInfoCtrl.create)

router.route('/update')
  .post(userInfoCtrl.update)

module.exports = router;
