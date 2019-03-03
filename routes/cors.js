const express = require('express');
const cors = require('cors');

const whitelist = ['http://localhost:3000', 'https://localhost:3443',
    'http://localhost:3001'];
var corsOptionsDelegate = (req, cb) => {
    var corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptionsDelegate = {origin: true};
    } else {
        corsOptions = {origin: false};
    }
    cb(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);