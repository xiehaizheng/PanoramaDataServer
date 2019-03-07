var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var config = require('../config');
var User = require('../models/users');
var ModelTypes = require('../models/ModelTypes');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, {expiresIn: 3600 * 24});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
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

exports.verifyUser = passport.authenticate("jwt", {session: false});

exports.verifyAuthor = (req, res, next) => {
    User.findOne({_id: req.user._id})
    .then((user) => {
        if (user.userType === ModelTypes.USER_TYPES.USER_AUTHOR) {
            next();
        } else {
            err = new Error('用户未通过上传者认证');
            err.status = 403;
            next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
};

exports.verifyAdmin = (req, res, next) => {
    User.findOne({_id: req.user._id})
    .then((user) => {
        if (user.userType === ModelTypes.USER_TYPES.USER_ADMIN) {
            next();
        } else {
            err = new Error('非权限用户');
            err.status = 403;
            next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
}