var redis = require('redis');
var redisClient;

var subscriptions = {};
var refreshTime = 5000; // in milliseconds
var bgTask;
 
function connect (connectionDetails) {
  redisClient = redis.createClient({host:connectionDetails.host, port:connectionDetails.port});
  redisClient.on('error', function(err) {
    console.log('Error: ' + err);
  });
}

function startCollection() {
  stopCollection();
  bgTask = setInterval(serveInfoToSubscriber, refreshTime);
}

function stopCollection() {
  if(bgTask) {
    clearInterval(bgTask);
    bgTask = null;
  }
}

function setRefreshTime(ms) {
  refreshTime = ms;
  startCollection();
}

function serveInfoToSubscribers () {
  var serverInfo = getServerInfo();
  for (var key in serverInfo) {
    if (serverInfo.hasOwnProperty(key)) {
      var callback = subscriptions[key];
      if (callback) {
        callback(key, serverInfo[key]);
      }
    }
  } 
}

function getServerInfo() {
  return redisClient.server_info;
}

function subscribe(attribute, handler) {
  var existingList = subscriptions[attribute];
  if (!existingList) existingList = [];
  existingList.push(handler);
  subscription[attribute] = existingList;

  console.log('Total subscription for ' + attribute + ' incresed to: '+existingList.length);
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
exports.setRefreshTime = setRefreshTime;
exports.subscribe = subscribe;
exports.startCollection = startCollection;
exports.stopCollection = stopCollection;
exports.getServerInfo = getServerInfo; 
