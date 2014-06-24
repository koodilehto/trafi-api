'use strict';

var rest = require('rest-sugar');
var sugar = require('object-sugar');

var schemas = require('./schemas');


module.exports = function(app) {
    app.all('*', function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With');

        next();
    });

    initV1(app);
};

function initV1(app) {
    var api = rest(app, '/v1/', {
        //libraries: schema // TODO
    }, sugar);

    api.pre(function() {
        // TODO: set limit to config.limit at max
        api.use(rest.only('GET'));
    });
}
