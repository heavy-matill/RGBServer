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
        mqttController.publish(data.topic, new Buffer(data.bytes));
    });
    socket.on('addAnimation', function(num_list,mode,data){
        rgbController.addAnimation(num_list,mode,data);
    });
});

socketApi.sendNotification = function() {
    io.sockets.emit('hello', {msg: 'Hello World!'});
}

module.exports = socketApi;
