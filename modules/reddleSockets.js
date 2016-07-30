var constants = require('../constants');
var reddle = require('./reddle');
var io;
var socketList = [];

function bindSocket(io) {
  this.io = io;
  
  /* Connect and start reddle */
  reddle.connect({host:constants.REDIS_HOST, port:constants.REDIS_PORT});
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
      var socketInfo = { socket: thisSocket, attribute: attribute };
      socketList.push(socketInfo);

      console.log('Registered attribue: ' + attribute);
      thisSocket.emit('reddle_register_attribue',{attribute: attribute, success: true});
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
      socketList = [];
      // TODO: UN-SUBSCRIBE ALL FROMM reddle
      
      console.log('Cleared all  stock listening requests');
    });
    
  });
}

function start() {

}

exports.bindSocket = bindSocket;
exports.start = start;
