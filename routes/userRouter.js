const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const authenticate = require('./authenticate');
const User = require('../models/users');

const userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.get('/', (req, res, next) => {
  res.send('respond with a response');
});

userRouter.post('/signup', (req, res, next) => {
  // options内容不存在则不写
  // {
  //   "username": "账号",
  //   "password": "密码",
  //   "nickname": "用户昵称",
  //   "userType": "(此处不接受用户输入，强制为0，即普通用户)",
  //   "options": {
  //       "gender": "gender",
  //       "dob": "1990/07/01",
  //       "email": "xxx@xxx.xxx",
  //       "addr": "地址",
  //       "phone": "+86 xxxxxx",
  //       "tel": "固话号码",
  //       "wechat": "微信号",
  //       "qq": "qq号"
  //   }
  // }
  // 使用local strategy注册用户
  // 不接受用户输入，userType强制为0，即普通用户
  req.body.userType = 0;
  User.register(new User(req.body),
      req.body.password, (err, user) => {
      if (err) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
      } else {
          // 使用local strategy验证用户
          passport.authenticate('local')(req, res, () => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: true, status: 'Registration Successful!'});
          });
      }
  });
});

userRouter.post('/login', passport.authenticate('local'), (req, res, next) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully ' +
      'logged in.'});
});

userRouter.get('/logout', (req, res, next) => { 
  if (req.user) {
      req.logout();
      res.redirect('/');
  } else {
      var err = new Error('You are not logged in!');
      err.status = 403;
      next(err);
  }
});

module.exports = userRouter;
