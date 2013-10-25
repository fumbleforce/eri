
var express = require('express');

function setTestConf(app) {
    console.log('Using test conf.');
    app.dbconf = {
        host : 'localhost',
        user : 'root',
        password : 'passord',
        database: 'ekarma_test',
    };
    app.use(express.errorHandler());
    app.DEBUG = true;
}

function setDevConf(app) {
    console.log('Using development conf.');
    app.dbconn = 'mongodb://master:mongisspill@ds047968.mongolab.com:47968/game';
    app.use(express.errorHandler());
    app.DEBUG = true;
}

function setProdConf(app){
    console.log('Using production conf.');
    app.dbconn = 'mongodb://master:mongisspill@ds047968.mongolab.com:47968/game'
    app.DEBUG = false;
}

module.exports.setDevConf = setDevConf;
module.exports.setTestConf = setTestConf;
module.exports.setProdConf = setProdConf;
