var EventEmitter = require('events').EventEmitter;
var redis = require('redis');
var redisParser = require('redis-info');

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
  if(bgTask) {
    clearInterval(bgTask);
  }
  bgTask = setInterval(serveInfoToSubscribers, refreshTime);
}

// Stop periodic task. Return True if the task active
function stopCollection() {
  if(bgTask) {
    clearInterval(bgTask);
    bgTask = null;
    return true;
  }
  else { return false; }
}

function setRefreshTime(ms) {
  refreshTime = ms;
  if(stopCollection()) {
    startCollection();
  }
}

function serveInfoToSubscribers () {
  getServerInfo(function(err, serverInfo) {
	if (err) return;
    for (var key in serverInfo) {
      if (serverInfo.hasOwnProperty(key)) {
        redisEvents.emit(key, { attribute: key,
                      value: serverInfo[key],
                      timestamp: (new Date())}
                      );
      }
    }
  });
}

function getServerInfo(callback) {
  redisClient.info(function(err, data) {
	  if (err){
	    callback(err);
    }
    else {
	    var info = parseInfo(data);
	    callback(null, info);
	  }
  });
}

function subscribe(attribute, handler) {
  redisEvents.on(attribute, handler);
  console.log('Listener added for ' + attribute + '. Total: '+redisEvents.listeners(attribute).length);
}

function removeAllSubscriptions() {
  redisEvents.removeAllListeners();
}

function parseInfo(data) {
  var info = redisParser.parse(data);
  //console.log(JSON.stringify(info, null, 4));

  return info;
}

exports.connect = connect;
exports.setRefreshTime = setRefreshTime;
exports.subscribe = subscribe;
exports.startCollection = startCollection;
exports.stopCollection = stopCollection;
exports.getServerInfo = getServerInfo;
exports.removeAllSubscriptions = removeAllSubscriptions;
