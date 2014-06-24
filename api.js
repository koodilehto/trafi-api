'use strict';

var is = require('annois');
var rest = require('rest-sugar');
var sugar = require('mongoose-sugar');

var config = require('./config');
var schemas = require('./schemas');


module.exports = function(app) {
    app.all('*', function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With');

        next();
    });

    initV1(app, schemas);
};

function initV1(app, schemas) {
    var api = rest(app, '/v1/', schemas, sugar);

    api.pre(function() {
        api.use(setMaxLimit(config.maxItemsPerPage));
        api.use(rest.only('GET'));
    });
}

function setMaxLimit(maxLimit) {
    return function(req, res, next) {
        var limit = Math.min(req.query.limit, maxLimit);

        if(is.nan(limit)) {
            req.query.limit = maxLimit;
        }

        next();
    };
}
