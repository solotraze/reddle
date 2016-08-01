/* Helper class to interact with server socket containing reddle component */
var reddleHelper = function (socket) {
  var self = this;
  this.socket = socket;
  this.callbacks = {}; // TODO: make it event based

  socket.on('reddle_register_attribute', function(data) {
    self.onAttributeRegistered(data);
  });
  // Following will be done from react ready event in index_react.js

  socket.on('reddle_attribute', function(data) {
    self.onAttributeReceived(data);
  });
}

reddleHelper.prototype.subscribeAttribute = function(attribute, callback) {
  if (socket) {
    socket.emit('reddle_register_attribute', attribute);
    this.callbacks[attribute] = callback;
  }
};

reddleHelper.prototype.unsubscribeAttribute = function(attribute) {
  if (socket) {
    socket.emit('reddle_deregister_attribute', attribute);
    this.callbacks[attribute] = null;
  }
};

reddleHelper.prototype.onAttributeReceived = function(data) {
  //console.log(data.attribute+' = '+data.value+' ('+data.timestamp +')');
  var callback = this.callbacks[data.attribute];
  if (callback) {
    callback(data);
  }
};

reddleHelper.prototype.onAttributeRegistered = function(data) {
  if (data.success) {
    console.log('Attribute successfully registered: '+ data.attribute);
  }
  else {
	console.log('Attribute could not be registered: '+ data.attribute);
  }
};

reddleHelper.prototype.setRefreshTime = function(ms) {
  if (socket) {
    socket.emit('reddle_set_refresh_time', ms);
  }
};

reddleHelper.prototype.clearClients = function() {
  if (socket) {
    socket.emit('reddle_clear_clients', '');
  }
  callbacks = {};
};
