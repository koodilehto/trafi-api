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
