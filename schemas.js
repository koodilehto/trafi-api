'use strict';

var mongoose = require('mongoose');
var sugar = require('mongoose-sugar');

var schema = sugar.schema(mongoose);

var datasets = require('./config').datasets;


datasets.forEach(function(name) {
    schema(exports, name).fields({
        gid: {type: String, required: true},
        languages: Object // {language: {name: ..., description: ...}}
    });
});

schema(exports, 'registrations').fields({
    gid: {type: String, required: true},
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
