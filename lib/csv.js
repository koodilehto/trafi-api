'use strict';

var csv = require('fast-csv');
var moment = require('moment');


exports.readRegistrations = function(path, cb, endCb) {
    endCb = endCb || noop;

    var stream = csv.fromPath(path, {
        headers: true
    }).
    transform(function(data) {
        return {
            gid: data.jarnro,
            'class': data.ajoneuvoluokka,
            registrationDate: parseDate('YYYY-MM-DD', data.ensirekisterointipvm),
            group: data.ajoneuvoryhma,
            usage: data.ajoneuvonkaytto,
            deployentDate: parseDate('YYYYMMDD', data.kayttoonottopvm),
            color: data.vari,
            doors: parseNumber(data.ovienLukumaara),
            chassis: data.korityyppi,
            cabin: data.ohjaamotyyppi,
            seats: parseNumber(data.istumapaikkojenLkm),
            mass: parseNumber(data.omamassa),
            // data.teknSuurSallKokmassa
            // data.tieliikSuurSallKokmassa
            length: parseNumber(data.ajonKokPituus),
            width: parseNumber(data.ajonKokWidth),
            height: parseNumber(data.ajonKokHeight),
            power: data.kayttovoima,
            largestNetPower: parseNumber(data.suurinNettoteho),
            cylinder: {
                capacity: parseNumber(data.iskutilavuus),
                amount: parseNumber(data.sylintereidenLkm)
            },
            compressor: data.ahdin,
            model: data.mallimerkinta,
            transmission: {
                type: data.voimanvalJaTehostamistapa,
                // data.vaihteisto,
                gears: data.vaihteidenLkm
            },
            name: {
                plain: data.merkkiSelvakielinen,
                commercial: data.kaupallinenNimi
            },
            // data.tyyppihyvaksyntanro
            // data.yksittaisKayttovoima
            municipality: data.kunta,
            co2: parseNumber(data.Co2)
        };
    }).
    on('record', function(data) {
        stream.pause();

        cb(null, data, function() {
            stream.resume();
        });
    }).
    on('end', function() {
        endCb();
    });
};

function parseDate(pattern, data) {
    var date = moment(data, pattern);

    if(date.isValid()) {
        return date.utc().format();
    }
}

function parseNumber(n) {
    return parseInt(n, 10) || undefined;
}

exports.read = function(path, cb, endCb) {
    endCb = endCb || noop;

    var accum = {};

    var stream = csv.fromPath(path, {
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
                stream.pause();

                cb(null, accum, function() {
                    stream.resume();
                });
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
            stream.pause();

            cb(null, accum, function() {
                stream.resume();

                endCb();
            });
        }
        else {
            endCb();
        }
    });
};

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

function noop() {}
