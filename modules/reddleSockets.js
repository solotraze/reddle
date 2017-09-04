var constants = require('../constants');
var reddle = require('./reddle');
var io;
var socketList = {};

function addToSocketWatchlist(socket, attribute, handler) {
  var curSocket = socketList[socket.id];
  if(!curSocket) {
    curSocket = {socket: socket, attributeHandlers: {}};
  }
  curSocket.attributeHandlers[attribute] = handler;
}
function removeFromSocketWatchlist(socket, attribute) {
  var curSocket = socketList[socket.id];
  if(curSocket) {
    curSocket.attributeHandlers[attribute] = null;
  }
}
function handlerFromSocketWatchlist(socket, attribute) {
  var curSocket = socketList[socket.id];
  if(curSocket) {
    return curSocket.attributeHandlers[attribute];
  }
}

function bindSocket(io) {
  this.io = io;

  /* Connect and start reddle */
  reddle.connect({host:constants.REDIS_HOST, port:constants.REDIS_PORT, password: constants.REDIS_PASSWORD});
  reddle.setRefreshTime(constants.REDDLE_DEFAULT_REFRESH_TIME);
  reddle.startCollection();

  io.on('connection', function(socket) {
    console.log('A reddle client connected');

    function onAttributeReceived(data) {
	    socket.emit('reddle_attribute', data);
	  }

    socket.on('reddle_register_attribute', function(attribute) {
      var thisSocket = this;

      reddle.subscribe(attribute, onAttributeReceived);
      addToSocketWatchlist(thisSocket, attribute, onAttributeReceived);

      console.log('Registered attribute: ' + attribute);
      thisSocket.emit('reddle_register_attribute',{attribute: attribute, success: true});
    });

    socket.on('reddle_deregister_attribute', function(attribute) {
      var thisSocket = this;

      //var handler = handlerFromSocketWatchlist(thisSocket, attribute)
      reddle.unsubscribe(attribute, onAttributeReceived);

      // TODO: get and remove handler from watchlist
      removeFromSocketWatchlist(thisSocket, attribute);

      console.log('De-registered attribute: ' + attribute);
      thisSocket.emit('reddle_deregister_attribute',{attribute: attribute, success: true});
    });

    socket.on('reddle_set_refresh_time', function(ms) {
	    try {
	      console.log('Setting refresh time to: ' + ms.toString() + ' milliseconds');
  	    // TODO: make it non-global
	      reddle.setRefreshTime(parseInt(ms));
	    }
	    catch(err) { console.log('Error: Failed to set refresh time.'); }
    });

    socket.on('reddle_clear_clients', function () {
      // TODO: get and remove handler from watchlist..UN-SUBSCRIBE ALL FROMM reddle
      socketList = {};

      reddle.removeAllSubscriptions();
      console.log('Cleared all listeners');
    });

  });
}

function start() {

}

exports.bindSocket = bindSocket;
exports.start = start;
