var socket; 
var reddleHelperObj;

function prepareUIElements() {
  $('#btnAction').click(onBtnActionClicked);
}

function onBtnActionClicked() {
  var redisAttr = 'used_memory';
  reddleHelperObj.subscribeAttribute(redisAttr);
  $('#dvContent').text('Subscribed for '+redisAttr);
}

$(document).ready(function(){
  // OpenShift exposes websockets on a specific port. So use that.
  socket = io(); 
  //socket = io.connect('http://quotrweb-littlestory.rhcloud.com:8000', {'forceNew':true}); 
  reddleHelperObj = new reddleHelper(socket);
  
  prepareUIElements(); 
});

