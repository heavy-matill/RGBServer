var socket_io = require('socket.io');
var io = socket_io();
var mqttController = require('./mqttController')
var socketApi = {};

socketApi.io = io;

io.on('connection', function(socket){
    //console.log('A user connected');
    socket.on('mqttPublish', function(data){
        mqttController.publish(data.topic, data.message);
    });
    socket.on('mqttPublishBytes', function(data){
        mqttController.publish(data.topic, new Buffer(data.bytes));
    });
});

socketApi.sendNotification = function() {
    io.sockets.emit('hello', {msg: 'Hello World!'});
}

module.exports = socketApi;
