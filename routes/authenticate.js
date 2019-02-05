var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var config = require('../config');
var User = require('../models/users');

// 添加中间件Local Strategy，配置passport序列化函数
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, {expiresIn: 3600});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

// jwt验证函数
exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        // callback函数done(错误, 对象)
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            } else if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));

// 配置passport验证方法
exports.verifyUser = passport.authenticate("jwt", {session: false});

exports.verifyVIP = function(req, res, next) {
    User.findOne({_id: req.user._id})
    .then((user) => {
        if (user.userType == 1) {
            next();
        } else {
            err = new Error('非VIP用户');
            err.status = 403;
            next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
};