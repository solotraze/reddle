/* Helper class to interact with server socket containing reddle component */
var reddleHelper = function (socket) {
  var self = this;
  this.socket = socket;
  
  socket.on('reddle_register_attribute', function(data) {
    self.onAttributeRegistered(data);
  });
  // Following will be done from react ready event in index_react.js
  
  socket.on('reddle_attribute', function(data) {
    self.onAttributeReceived(data); 
  });
}

reddleHelper.prototype.subscribeAttribute = function(attribute) {
  if (socket) {
    socket.emit('reddle_register_attribute', attribute);
  }
};

reddleHelper.prototype.onAttributeReceived = function(data) {
  console.log(data.attribute+' = '+data.value+' ('+data.timestamp +')');
};

reddleHelper.prototype.onAttributeRegistered = function(msg) {
  console.log('attribute registered');
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
};
