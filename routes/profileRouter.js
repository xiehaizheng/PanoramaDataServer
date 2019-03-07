const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('./authenticate');
const Profiles = require('../models/profiles');
const cors = require('./cors');

const profileRouter = express.Router();
profileRouter.use(bodyParser.json());

profileRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Profiles.find(req.query)
    .populate('user')
    .then((profiles) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(profiles);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    req.body.user = req.user._id;
    Profiles.create(req.body)
    .then((profiles) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(profiles);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({err: 'PUT operation not supported on /profiles'})
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Profiles.remove(req.query)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

profileRouter.route('/:profileId')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Profiles.findOne({ _id: req.params.profileId })
    .then((profile) => {
        if (!profile.user.equals(req.user._id)) {
            var err = new Error('无权限查看个人信息');
            err.status = 403;
            return next(err);
        } 
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(profile);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({err: 'POST operation not supported on /profiles/' + req.params.profileId});
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Profiles.findOne({ _id: req.params.profileId })
    .then((profile) => {
        if (profile != null) {
            if (!profile.user._id.equals(req.user._id)) {
                var err = new Error('无权限修改用户个人信息');
                err.status = 403;
                return next(err);
            }
            req.body.user = req.user._id;
            Profiles.findOneAndUpdate({ _id: req.params.profileId }, {
                $set: req.body
            }, { new: true })
            .then((profile) => {
                Profiles.findOne(profile._id)
                .populate('user')
                .then((profile) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(profile);
                })
            })
        } else {
            err = new Error('个人信息 ' + req.params.profileId + ' 不存在');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Profiles.findOneAndRemove({_id: req.params.profileId})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    })
});

module.exports = profileRouter;