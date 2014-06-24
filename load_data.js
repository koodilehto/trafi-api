'use strict';

var path = require('path');

var async = require('async');
var glob = require('glob');
var sugar = require('object-sugar');

var csv = require('./lib/csv');
var schemas = require('./schemas');


exports.registrations = function(p, cb) {
    var schema = schemas.registrations;

    csv.readRegistrations(p, function(err, data) {
        if(err) {
            return cb(err);
        }

        load(schema, data, cb);
    }, cb);
};

exports.csvs = function(p, cb) {
    glob(path.join(p, '*.csv'), function(err, paths) {
        if(err) {
            return cb(err);
        }

        async.each(paths, function(p, cb) {
            var name = path.basename(p, path.extname(p));

            csv.read(p, function(err, data) {
                if(err) {
                    return cb(err);
                }

                load(schemas[name], data, cb);
            }, cb);
        }, cb);
    });
};

function load(schema, data, cb) {
    sugar.getOrCreate(schema, {
        gid: data.gid
    }, function(err, d) {
        if(err) {
            return cb(err);
        }

        sugar.update(schema, d._id, data, function(err) {
            if(err) {
                return cb(err);
            }
        });
    });
}