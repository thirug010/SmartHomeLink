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


var SmartLink = {};

SmartLink.deviceList = [   {smartlinkid:'APhe68Gb1Ob3fN8Le65FtJRQNm85' ,	room:'hallway',		 device:'light',		subdevice:'',			name: 'Hall Way', 		id:'HallWayLight'       },
                           { smartlinkid:'APhe68Gb1Ob3fN8Le65FtJRQNm85' ,	room:'loft',		 device:'light',		subdevice:'',			name: 'Loft' , 			id:'LoftLight'          },
                           { smartlinkid:'APhe68Gb1Ob3fN8Le65FtJRQNm85' ,	room:'media room',	 device:'outlet',		subdevice:'',			name: 'Media Outlet' ,	id:'MediaRoomOutLet'    },
                           { smartlinkid:'APhe68Gb1Ob3fN8Le65FtJRQNm85' ,	room:'living room',	 device:'light',		subdevice:'',			name: 'Living Room' , 	id:'LivingRoomLight'    },
                           { smartlinkid:'APhe68Gb1Ob3fN8Le65FtJRQNm85' ,	room:'dining room',	 device:'light',		subdevice:'',			name: 'Dining Room' , 	id:'DiningRoomLight'    },
                           { smartlinkid:'APhe68Gb1Ob3fN8Le65FtJRQNm85' ,	room:'media room',	 device:'light',		subdevice:'',			name: 'Media Light' ,	id:'MediaRoomLight'     },
                           { smartlinkid:'APhe68Gb1Ob3fN8Le65FtJRQNm85' ,	room:'garage',		 device:'light',		subdevice:'',			name: 'Garage Light', 	id:'GarageLight'        },
                           { smartlinkid:'APhe68Gb1Ob3fN8Le65FtJRQNm85' ,	room:'front',		 device:'door',			subdevice:'lock',		name: 'Front Door' ,	id:'FrontDoor'          },
                           { smartlinkid:'APhe68Gb1Ob3fN8Le65FtJRQNm85' ,	room:'back',		 device:'door', 		subdevice:'lock',		name: 'Back Door', 		id:'BackDoor'           },
                           { smartlinkid:'APhe68Gb1Ob3fN8Le65FtJRQNm85' ,	room:'groundfloor',	 device:'temp', 		subdevice:'',			name: 'Ground Floor' , 	id:'GroundFloorTemp'    },
                           { smartlinkid:'APhe68Gb1Ob3fN8Le65FtJRQNm85' ,	room:'firstfloor',	 device:'temp',			subdevice:'',			name: 'First Floor', 	id:'FirstFloorTemp'     },
                           { smartlinkid:'APhe68Gb1Ob3fN8Le65FtJRQNm85' ,	room:'garage',		 device:'door', 		subdevice:'',			name: 'Garage Door' , 	id:'GarageDoor'         },
                           { smartlinkid:'APhe68Gb1Ob3fN8Le65FtJRQNm85' ,	room:'living room',	 device:'window', 		subdevice:'blind',		name: 'Window' , 		id:'Window'             },
                           { smartlinkid:'APhe68Gb1Ob3fN8Le65FtJRQNm85' ,	room:'media room',	 device:'fan', 			subdevice:'',			name: 'Tower Fan' , 	id:'TowerFan'           },
                           { smartlinkid:'APhe68Gb1Ob3fN8Le65FtJRQNm85' ,	room:'media room',	 device:'outlet', 		subdevice:'',			name: 'Device' , 		id:'Device'             },
                           { smartlinkid:'APhe68Gb1Ob3fN8Le65FtJRQNm85' ,	room:'living room',	 device:'tv', 			subdevice:'',			name: 'LG TV' , 		id:'LGTV'               }
                     ];
SmartLink.actionStatusList = [
	{action : 'smartlink.device.on' ,       status : 'turned on'},
	{action : 'smartlink.device.open' ,     status : 'opened' },
	{action : 'smartlink.device.up' ,       status : 'opened'},
	{action : 'smartlink.device.set' ,      status : 'set' },

	{action : 'smartlink.device.off' ,      status : 'turned off'},
	{action : 'smartlink.device.close' ,    status : 'closed'},
	{action : 'smartlink.device.down' ,     status : 'closed'},
	{action : 'smartlink.device.status',    status : ''}
];

SmartLink.getActionInfo = function(actionID)
{
    var retList =  this._getItemsfromList(SmartLink.actionStatusList, 'action' , actionID);
    var message = "no such action found";
    var found  = false;
    if(retList.length > 0)
        {
            found = true;
            message = retList[0].status;
        }
    return  {actionID : actionID, found : found, message : message };
}
SmartLink._getItemsfromList = function(list, property, value)
{
    var retlist = [];
    for(var i=0; i < list.length; i++)
        {
            var item = list[i];
            
            if(item[property] == value)
                {
                    retlist.push(item);
                }
        }
        return retlist;
} 
SmartLink.getSpecificDevice = function(smartLinkID, paramters)
{

    var dev = {};
    var roomOnly = false;
    var devOnly = false;
    var devFound =  false;

    var list =  this._getItemsfromList(SmartLink.deviceList, 'smartlinkid' , smartLinkID);
    
    for(var i=0; i < list.length; i++)
        {
            var item = list[i];
            if(item.room == paramters.room && item.device == paramters.device)
                {
                    devFound = true;
                    dev = item;
                    break;
                }
            if(item.room == paramters.room)
                {
                    roomOnly  =true;
                }
             if(item.device == paramters.device)
                {
                    devOnly  =true;
                }
        }
    if(devFound)
        {
            return { deviceInfo : dev, found : true, message : paramters.device + ' in the ' + paramters.room};
        }
    else if (roomOnly)
        {
            return { deviceInfo : dev, found : false, message : 'no device called '+ paramters.device + ' found in the ' + paramters.room +' please try again with valid device name'};
        }
    else if (devOnly)
        
        {
            return { deviceInfo : dev, found : false, message : 'no room called ' + paramters.room + ' configured in the user profile, please try again with valid room'};
        }
    else
        {
            return { deviceInfo : dev, found : false, message : 'no room ' + paramters.room + ' or no device '+paramters.device+' configured in the user profile, please try again'};
        }
} 

if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };
}



restService.post('/link', function(req, res) { 
    var parameters = "";
    var actionInfo = "";
	
    var parameters_sr = {};
    var actionInfo_sr = {};
    var userInfo_sr = {};
	
    var userInfo   = req.body.originalRequest && req.body.originalRequest.data && req.body.originalRequest.data.user ? req.body.originalRequest.data.user:{};
    userInfo_sr = userInfo;
    userInfo = JSON.stringify(userInfo);
    
    var param = {all:'', room : '' , device : ''};
    parameters = req.body.result && req.body.result.parameters ? req.body.result.parameters : param;
    parameters_sr = parameters;
    parameters = JSON.stringify(parameters);
    parameters = parameters.replace('device-sub','devicesub');
    
    actionInfo = req.body.result && req.body.result.action ? req.body.result.action : 'smartlink.device.unkown';
    actionInfo_sr = actionInfo;

    var deviceName = req.body.result && req.body.result.parameters && req.body.result.parameters.deviceName ? req.body.result.parameters.deviceName : "No such Device in your Home"
    var deviceAction = req.body.result && req.body.result.parameters && req.body.result.parameters.deviceAction ? req.body.result.parameters.deviceAction : "No such Action supported for all devies in your Home"
    
    var devInfo = SmartLink.getSpecificDevice(userInfo_sr.userId,parameters_sr);
    var actInfo = SmartLink.getActionInfo(actionInfo_sr);   
    var speech ="";
    
    if(devInfo.found && actInfo.found)
        {
            speech = devInfo.message + ' is ' + actInfo.message;
        }
    
    else if(devInfo.found && !actInfo.found)
        {
            speech = actInfo.message + ' for ' + devInfo.message + ', please try again with valid action';
        }
    else if (!devInfo.found)
        {
            speech = devInfo.message;
        } 
        
    var url = "http://smarthome2707.ddns.net/wapi/smartLinkDevice?userInfo=" + userInfo + '&parameters=' + parameters + '&actionInfo=' + actionInfo + '&t = ' + (new Date()).toLocaleTimeString()
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
