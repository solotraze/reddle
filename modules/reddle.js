var redis = require('redis');
var redisClient;

var subscriptions = {};
 
function connect (connectionDetails) {
  redisClient = redis.createClient({host:connectionDetails.host, port:connectionDetails.port});
  redisClient.on('error', function(err) {
    console.log('Error: ' + err);
  });
}

function getServerInfo() {
  return redisClient.server_info;
}

function subscribe(attribute, handler) {
  var existingList = subscriptions[attribute];
  if (!existingList) existingList = [];
  existingList.push(handler);
  subscription[attribute] = existingList;

  console.log('Total subscription for ' + attribute + ' incresed to: '+existingList.length;
}

/*
function getObjectFromCache(key, callback) {
  redisClient.get(key, function (err, response) {
    if (err) callback(err);
    callback(null, response);
  });
}
*/

exports.connect = connect;
exports.getServerInfo = getServerInfo; 