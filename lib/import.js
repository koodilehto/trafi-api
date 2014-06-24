'use strict';

var csv = require('fast-csv');


module.exports = function(path, cb) {
    var accum = {};

    csv.fromPath(path, {
        headers: true
    }).
    transform(function(data) {
        var ret = {};

        Object.keys(data).forEach(function(k) {
            ret[k.toLowerCase()] = data[k];
        });

        return ret;
    }).
    on('record', function(data) {
        if(data.gid === accum.gid) {
            accum.languages[data.language] = parse(data);
        }
        else {
            if(accum) {
                cb(null, accum);
            }

            accum = {
                gid: data.gid,
                languages: {}
            };

            accum.languages[data.language] = parse(data);
        }
    }).
    on('end', function() {
        if(accum) {
            cb(null, accum);
        }
    });
}

function parse(data) {
    var ret = {};

    if(data.name) {
        ret.name = data.name;
    }

    if(data.description) {
        ret.description = data.description;
    }

    return ret;
}
