var redis = require('redis');
var redisIp = '192.168.1.4';//127.0.0.1
var redisClient = redis.createClient({host:redisIp});

redisClient.on('error', function(err) {
  console.log('Error: ' + err);
});

function getServerInfo() {
  return redisClient.server_info;
}

/*
function getObjectFromCache(key, callback) {
  redisClient.get(key, function (err, response) {
    if (err) callback(err);
    callback(null, response);
  });
}
*/

exports.getServerInfo = getServerInfo; 
