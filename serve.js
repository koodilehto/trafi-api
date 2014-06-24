#!/usr/bin/env node
'use strict';

require('log-timestamp');

var async = require('async');
var errorHandler = require('errorhandler');
var express = require('express');
var sugar = require('mongoose-sugar');

var config = require('./config');
var api = require('./api');


if(require.main === module) {
    main();
}

module.exports = main;
function main() {
    handleExit();

    async.series([
        sugar.connect.bind(null, sugar.parseAddress(config.mongo)),
        serve.bind(null, config)
    ], function(err) {
        if(err) {
            return console.error(err);
        }
    });
}

function handleExit() {
    process.on('exit', terminator);

    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS',
    'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGPIPE', 'SIGTERM'
    ].forEach(function(element) {
        process.on(element, function() {
            terminator(element);
        });
    });
}

function serve(config, cb) {
    cb = cb || noop;

    var app = express();

    var env = process.env.NODE_ENV || 'development';
    if(env === 'development') {
        app.use(errorHandler());
    }

    api(app);

    app.listen(config.port, function(err) {
        if(err) {
            return cb(err);
        }

        console.log(
            'Node (version: %s) %s started on %d ...',
            process.version,
            process.argv[1],
            config.port
        );

        cb();
    });
}

function terminator(sig) {
    if(typeof sig === 'string') {
        console.log('%s: Received %s - terminating Node server ...',
            Date(Date.now()), sig);

        process.exit(1);
    }

    console.log('%s: Node server stopped.', Date(Date.now()) );
}

function noop() {}
