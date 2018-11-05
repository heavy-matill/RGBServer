var mqtt = require('mqtt')
var client  = mqtt.connect('tcp://192.168.178.116:1883')
 
client.on('connect', function () {
  client.subscribe('presence', function (err) {
    if (!err) {
      client.publish('presence', 'Hello mqtt')
    };
  });
});
 
client.on('message', function (topic, message) {
  console.log(message.toString());
});

exports.publish = function(topic, message){
	client.publish(topic, message); 
};