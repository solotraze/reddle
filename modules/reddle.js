var EventEmitter = require('events').EventEmitter;
var redis = require('redis');

var redisClient;
var redisEvents = new EventEmitter();

var refreshTime = 5000; // in milliseconds
var bgTask;
 
function connect (connectionDetails) {
  redisClient = redis.createClient(connectionDetails);
  redisClient.on('error', function(err) {
    console.log('Error: ' + err);
  });
}

function startCollection() {
  bgTask = setInterval(serveInfoToSubscribers, refreshTime);
}

function stopCollection() {
  if(bgTask) {
    clearInterval(bgTask);
    bgTask = null;
  }
}

function setRefreshTime(ms) {
  refreshTime = ms;
  stopCollection();
  startCollection();
}

function serveInfoToSubscribers () {
  var serverInfo = getServerInfo();
  for (var key in serverInfo) {
    if (serverInfo.hasOwnProperty(key)) {
      redisEvents.emit(key, { attribute: key,
                    value: serverInfo[key],
                    timestamp: (new Date())}
                    );
    }
  } 
}

function getServerInfo() {
  return redisClient.server_info;
}

function subscribe(attribute, handler) {
  redisEvents.on(attribute, handler);
  console.log('Listener added for ' + attribute + '. Total: '+redisEvents.listeners(attribute).length);
}

function removeAllSubscriptions() {
  redisEvents.removeAllListeners();
}

exports.connect = connect;
exports.setRefreshTime = setRefreshTime;
exports.subscribe = subscribe;
exports.startCollection = startCollection;
exports.stopCollection = stopCollection;
exports.getServerInfo = getServerInfo; 
exports.removeAllSubscriptions = removeAllSubscriptions;
