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

restService.post('/link', function(req, res) { 
    var parameters = "";
    var actionInfo = "";
    var userInfo   = req.body.originalRequest && req.body.originalRequest.data && req.body.originalRequest.data.user ? req.body.originalRequest.data.user:{};
    userInfo = JSON.stringify(userInfo);
    
    var param = {all:'', room : '' }
    parameters = req.body.result && req.body.result.parameters ? req.body.result.parameters : param;
    parameters = JSON.stringify(parameters);
    parameters = parameters.replace('device-sub','devicesub');
    
    actionInfo = req.body.result && req.body.result.action ? req.body.result.action : 'smartlink.device.unkown';
    actionInfo = JSON.stringify(actionInfo);

    var deviceName = req.body.result && req.body.result.parameters && req.body.result.parameters.deviceName ? req.body.result.parameters.deviceName : "No such Device in your Home"
    var deviceAction = req.body.result && req.body.result.parameters && req.body.result.parameters.deviceAction ? req.body.result.parameters.deviceAction : "No such Action supported for all devies in your Home"
    
    var speech = "Action completed";
    
    var url = "http://smarthome2707.ddns.net/wapi/smartLinkDevice?userInfo=" + userInfo + '&parameters=' + parameters + '&actionInfo=' + actionInfo
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
