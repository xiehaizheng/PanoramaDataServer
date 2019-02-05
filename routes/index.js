const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('./authenticate');
const indexRouter = express.Router();

/* GET home page. */
indexRouter.route('/test')
.get(authenticate.verifyUser, (req, res, next) => {
  res.end('普通用户，你好！');
})
.post(authenticate.verifyUser, authenticate.verifyVIP, (req, res, next) => {
  res.end('尊敬的会员，您好！');
})

module.exports = indexRouter;
