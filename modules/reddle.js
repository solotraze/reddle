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
  startCollection();
}

function serveInfoToSubscribers () {
  var serverInfo = getServerInfo();
  for (var key in serverInfo) {
    if (serverInfo.hasOwnProperty(key)) {
      var handlers = subscriptions[key];
      if (handlers) {
        for(var i = 0; i < handlers.length; i++) {
          var handler = handlers[i];
          handler({ attribute: key,
                    value: serverInfo[key],
                    timestamp: (new Date())});
        }
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
  subscriptions[attribute] = existingList;

  console.log('Listener added for ' + attribute + '. Total: '+existingList.length);
}

exports.connect = connect;
exports.setRefreshTime = setRefreshTime;
exports.subscribe = subscribe;
exports.startCollection = startCollection;
exports.stopCollection = stopCollection;
exports.getServerInfo = getServerInfo; 
