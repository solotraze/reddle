var redis = require('redis');
var redisClient;

function connect(connectionDetails) {
  redisClient = redis.createClient({host:connectionDetails.host, port:connectionDetails.port});
  redisClient.on('error', function(err) {
    console.log('Error: ' + err);
  });
}

function addObjectToCache(key, obj, callback) {
  redisClient.set(key, obj, function (err, response) {
    if (err) callback(err);
    callback(null, response);
  });
}

function getObjectFromCache(key, callback) {
  redisClient.get(key, function (err, response) {
    if (err) callback(err);
    callback(null, response);
  });
}

exports.connect = connect;
exports.addObjectToCache = addObjectToCache; 
exports.getObjectFromCache = getObjectFromCache;
