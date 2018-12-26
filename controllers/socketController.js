var socket_io = require('socket.io');
var io = socket_io();
var mqttController = require('./mqttController')
var rgbController = require('./rgbController')
var socketApi = {};

socketApi.io = io;

io.on('connection', function(socket){
    console.log('A user connected');
    socket.on('mqttPublish', function(data){
        mqttController.publish(data.topic, data.message);
    });
    socket.on('mqttPublishBytes', function(data){
        var strBytes = "";
        for (val of data.bytes){
            if (val < 0x10){
                strBytes = strBytes+"0";
            }
            strBytes = strBytes+val.toString(16);
        }
        //var strBytes = String.fromCharCode(...(data.bytes));
        strBytes = strBytes.toUpperCase();
        console.log(strBytes);
        mqttController.publish(data.topic, strBytes);
    });
    socket.on('addAnimation', function(num_list,mode,data){
        rgbController.addAnimation(num_list,mode,data);
    });
});

socketApi.sendNotification = function() {
    io.sockets.emit('hello', {msg: 'Hello World!'});
}

module.exports = socketApi;
