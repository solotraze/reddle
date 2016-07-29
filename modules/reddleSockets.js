var reddle = require('./reddle');
var io;

function bindSocket(io) {
  this.io = io;
  io.on('connection', function(socket) {
    console.log('A reddle client connected');

    socket.on('reddle_register_attribute', function(attribute) {
      
    }); 
  });
}

function start() {

}

exports.bindSocket = bindSocket;
exports.start = start;
