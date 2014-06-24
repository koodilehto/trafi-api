#!/usr/bin/env node
'use strict';

require('log-timestamp');

var path = require('path');

var async = require('async');
var glob = require('glob');
var is = require('annois');
var sugar = require('mongoose-sugar');

var config = require('./config');
var csv = require('./lib/csv');
var schemas = require('./schemas');


if(require.main === module) {
    main();
}

function main() {
    console.log('Starting loading');

    console.log('Connecting to database');

    sugar.connect(sugar.parseAddress(config.mongo), function(err) {
        if(err) {
            return console.error(err);
        }

        console.log('Connected to database');

        async.series([
            registrations.bind(null, config.registrationPath), // XXX: chokes with full dataset
            csvs.bind(null, path.join(__dirname, 'csv'))
        ], function(err) {
            if(err) {
                return console.error(err);
            }

            console.log('Done loading');

            sugar.disconnect();
        });
    });
}

function registrations(p, cb) {
    var schema = schemas.registrations;

    var q = async.queue(function(task, cb) {
        load('registrations', schema, task.data, cb);
    }, 4);
    q.drain = function() {
        cb();
    };

    csv.readRegistrations(p, function(err, data) {
        if(err) {
            return cb(err);
        }

        q.push({
            data: data
        }, function(err) {
            if(err) {
                return console.error(err);
            }
        });
    });
}

function csvs(p, cb) {
    glob(path.join(p, '*.csv'), function(err, paths) {
        if(err) {
            return cb(err);
        }

        async.eachSeries(paths, function(p, cb) {
            var name = path.basename(p, path.extname(p));

            var q = async.queue(function(task, cb) {
                load(name, schemas[name], task.data, cb);
            }, 4);
            q.drain = function() {
                cb();
            };

            csv.read(p, function(err, data) {
                if(err) {
                    return cb(err);
                }

                q.push({
                    data: data
                }, function(err) {
                    if(err) {
                        return console.error(err);
                    }
                });
            });
        }, cb);
    });
}

function load(name, schema, data, cb) {
    console.log('loading', name, data.gid);

    if(!is.defined(data.gid)) {
        return cb();
    }

    sugar.getOrCreate(schema, {
        gid: data.gid
    }, function(err, d) {
        if(err) {
            return cb(err);
        }

        sugar.update(schema, d._id, data, cb);
    });
}