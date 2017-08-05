'use strict';

var http = require('http');

const express = require('express');
const bodyParser = require('body-parser');

const restService = express();

restService.use(bodyParser.urlencoded({
    extended: true
}));

restService.use(bodyParser.json());

restService.post('/echo', function(req, res) {
    var deviceName = req.body.result && req.body.result.parameters && req.body.result.parameters.deviceName ? req.body.result.parameters.deviceName : "No such Device in your Home"
    var deviceAction = req.body.result && req.body.result.parameters && req.body.result.parameters.deviceAction ? req.body.result.parameters.deviceAction : "No such Action supported for all devies in your Home"
    
    var speech = deviceName + " is " + deviceAction;
    
    var url = "http://smarthome2707.ddns.net/wapi/smartLinkDevice?deviceName="+deviceName+"&deviceAction=" + deviceAction    
    http.get(url, function(response) {
          var finalData = "";

          response.on("data", function (data) {
            finalData += data.toString();
          });

          response.on("end", function() {
          });
    });
        return res.json({
        speech: speech,
        displayText: speech,
        source: 'webhook-echo-sample'
    });
});


restService.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});
