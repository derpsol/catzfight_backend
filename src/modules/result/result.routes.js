const express = require('express');
const resultCtrl = require('./result.controller');

const router = express.Router();

router.route('/')
  .get(resultCtrl.list);

module.exports = router;
