var socket; 

function prepareUIElements() {
  $('#btnAction').click(function () {
    $('#dvContent').text('Clicked');
  });
}

$(document).ready(function(){
  // OpenShift exposes websockets on a specific port. So use that.
  socket = io(); 
  //socket = io.connect('http://quotrweb-littlestory.rhcloud.com:8000', {'forceNew':true}); 

  socket.on('reddle_register_attribute, function(msg) {
    onAttributeRegistered(msg);
  });
  // Following will be done from react ready event in index_react.js
  
  socket.on('reddle_attribute', function(data) {
    onAttributeReceived(data); 
  });

  prepareUIElements(); 
});

var subscribeAttribute = function(attribute) {
  if (socket) {
    socket.emit('reddle_register_attribute', stockCode);
  }
};

var onAttributeReceived = function(data) {
  console.log(data.attribute+' = '+data.value+' ('+data.timestamp +')');
}

var onAttributeRegistered(msg) {
  console.log('attribute registered');
}

var setRefreshTime = function(ms) {
  if (socket) {
    socket.emit('reddle_set_refresh_time', ms);
  }
};

var clearClients = function() {
  if (socket) {
    socket.emit('reddle_clear_clients', '');
  }
};
