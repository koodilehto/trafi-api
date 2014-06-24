'use strict';

var sugar = require('object-sugar');

var schema = sugar.schema();

var datasets = require('./config').datasets;


datasets.forEach(function(name) {
    schema(exports, name).fields({
        gid: String,
        languages: Object // {language: {name: ..., description: ...}}
    });
});

schema(exports, 'registrations').fields({
    gid: String,
    'class': String,
    registrationDate: Date,
    group: String,
    usage: String,
    deploymentDate: Date,
    color: String,
    doors: Number,
    chassis: String,
    cabin: String,
    seats: Number,
    mass: Number,
    length: Number,
    width: Number,
    height: Number,
    power: String,
    largestNetPower: Number,
    cylinder: Array, // capacity, amount
    compressor: String,
    model: String,
    transmission: Array, // type, gears
    name: Array, // plain, commercial
    municipality: String,
    co2: Number
});
