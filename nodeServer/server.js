var express = require('express');
var app = express();
var mongoose    = require('mongoose');

var port = 8800;
     
var router = require('./router/main')(app, mongoose)


var server = app.listen(port, function() {
    console.log("MES Server has started on port "+port);
});

