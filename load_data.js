'use strict';

var path = require('path');

var async = require('async');
var glob = require('glob');
var sugar = require('object-sugar');

var readCsv = require('./lib/csv').read;
var schemas = require('./schemas');


module.exports = function(p, cb) {
    glob(path.join(p, '*.csv'), function(err, paths) {
        if(err) {
            return cb(err);
        }

        async.each(paths, function(p, cb) {
            var name = path.basename(p, path.extname(p));

            readCsv(p, function(err, csvData) {
                if(err) {
                    return cb(err);
                }

                var schema = schemas[name];

                sugar.getOrCreate(schema, {
                    gid: csvData.gid
                }, function(err, d) {
                    if(err) {
                        return cb(err);
                    }

                    sugar.update(schema, d._id, csvData, function(err) {
                        if(err) {
                            return cb(err);
                        }
                    });
                });
            }, cb);
        }, cb);
    });
};
