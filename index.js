'use strict';

var http = require('http');

const express = require('express');
const bodyParser = require('body-parser');

const restService = express();

restService.use(bodyParser.urlencoded({
    extended: true
}));

restService.use(bodyParser.json());

restService.get('/linkget', function (req, res) 
{
  res.send('Get Response')
});

restService.get('/link', function(req, res) {
    /*
    var userInfo   = JSON.stringify(req.body.originalRequest && req.body.originalRequest.data && req.body.originalRequest.data.user ? req.body.originalRequest.data.user : {});
    var parameters = JSON.stringify( req.body.result && req.body.result.parameters ? req.body.result.parameters : {} ).replace('device-sub','devicesub');
    var actionInfo = JSON.stringify(req.body.result && req.body.result.action ? action : {})
    */
    var deviceName = req.body.result && req.body.result.parameters && req.body.result.parameters.deviceName ? req.body.result.parameters.deviceName : "No such Device in your Home"
    var deviceAction = req.body.result && req.body.result.parameters && req.body.result.parameters.deviceAction ? req.body.result.parameters.deviceAction : "No such Action supported for all devies in your Home"
    
    var speech = deviceName + " is " + deviceAction;
    
    var url = "http://smarthome270
    7.ddns.net/wapi/smartLinkDevice?userInfo=" + userInfo + '&parameters=' + parameters + '&actionInfo=' + actionInfo
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
