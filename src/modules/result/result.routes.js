const express = require('express');
const resultCtrl = require('./result.controller');

const router = express.Router();

router.route('/')
  .get(resultCtrl.list);

router.route('/create')
  .post(resultCtrl.create)

module.exports = router;
