const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const authenticate = require('./authenticate');
const User = require('../models/users');
const cors = require('./cors');
const ModelTypes = require('../models/ModelTypes');
const config = require('../config');

const userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); });

userRouter.route('/')
.get(authenticate.verifyUser, authenticate.verifyAdmin,
	(req, res, next) => {
	User.find({})
	.then((users) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(users);
	}, (err) => next(err))
	.catch((err) => next(err));
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin,
	(req, res, next) => {
	User.remove({userType: {
		$ne: ModelTypes.USER_TYPES.USER_ADMIN
	}})
	.then((resp) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(resp);
	}, (err) => next(err))
	.catch((err) => next(err));
})

userRouter.post('/signup', (req, res, next) => {
	User.register(new User({
		username: req.body.username,
		nickname: req.body.nickname
	}),
	req.body.password, (err, user) => {
		if (err) {
			res.statusCode = 401;
			res.setHeader('Content-Type', 'application/json');
			switch (err.name) {
				case 'MongoError':
					if (err.code === 11000) {
						return res.json({ success: false, status: '昵称已存在', err: err });
					}
				case 'UserExistsError':
					return res.json({ success: false, status: '用户已存在', err: err });
				case 'MissingPasswordError':
					return res.json({ success: false, status: '请输入密码', err: err });
				default:
					return res.json({ success: false, status: '注册失败', err: err });
			}
		}
		passport.authenticate('local')(req, res, () => {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json({ success: true, status: '注册成功' });
		});
	});
});

userRouter.post('/login', (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			res.statusCode = 401;
			res.setHeader('Content-Type', 'application/json');
			switch (info.name) {
				case 'IncorrectUsernameError':
					return res.json({ success: false, status: '用户名错误', err: info });
				case 'IncorrectPasswordError':
					return res.json({ success: false, status: '密码错误', err: info });
				default:
					return res.json({ success: false, status: 'local认证失败', err: info });
			}
		}
		req.logIn(user, (err) => {
			if (err) {
				res.statusCode = 401;
				res.setHeader('Content-Type', 'application/json');
				return res.json({ success: false, status: '登录失败', err: err });
			}
			var token = authenticate.getToken({ _id: req.user._id });
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json({ success: true, status: '登录成功', token: token });
		});
	})(req, res, next);
});

userRouter.post('/authorize', authenticate.verifyUser, (req, res, next) => {
	if (!req.body.userType) {
		res.statusCode = 403;
		res.setHeader('Content-Type', 'application/json');
		return res.json({ success: false, status: '修改用户类型失败', err: '未指定userType' });
	} else if (req.body.adminKey !== config.adminKey) {
		res.statusCode = 403;
		res.setHeader('Content-Type', 'application/json');
		return res.json({ success: false, status: '修改用户类型失败', err: '无权限修改用户类型' });
	}
	User.findOneAndUpdate({_id: req.user._id}, {
		$set: {userType: req.body.userType}
	}, {
		new: true,
		runValidators: true
	})
	.then((user) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json({ success: true, status: '修改用户类型成功', user: user });
	}, (err) => next(err))
	.catch((err) => next(err));
});

userRouter.get('/logout', (req, res, next) => {
	if (req.session) {
		req.session.destroy();
		res.clearCookie('session-id');
		return res.redirect('/');
	}
	var err = new Error('用户尚未登录');
	err.status = 403;
	next(err);
});

userRouter.get('checkToken', (req, res) => {
	passport.authenticate('jwt', { session: false }, (err, user, info) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			res.statusCode = 401;
			res.setHeader('Content-Type', 'application/json');
			return res.json({ status: 'Token不可用', success: false, err: info });
		}
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		return res.json({ status: 'Token可用', success: true, user: user });
	})(req, res);
})

module.exports = userRouter;
