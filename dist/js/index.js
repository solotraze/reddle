var socket;
var reddleHelperObj;

function prepareUIElements() {
  $('#btnAction').click(onBtnActionClicked);
  $('#btnRemove').click(onBtnRemoveClicked);
  $('#btnClearClients').click(onBtnClearClientsClicked);
}

function onBtnActionClicked() {
  var redisAttr = $('#txtAttribute').val();
  reddleHelperObj.subscribeAttribute(redisAttr, function (data){
	  $('#dvContent').html(data.attribute+' = '+data.value+' ('+data.timestamp+')');
  });
}

function onBtnRemoveClicked() {
  var redisAttr = $('#txtAttribute').val();
  reddleHelperObj.unsubscribeAttribute(redisAttr);
}

function onBtnClearClientsClicked() {
  $('#dvContent').val('');
  reddleHelperObj.clearClients();
}

$(document).ready(function(){
  // OpenShift exposes websockets on a specific port. So use that.
  socket = io();
  //socket = io.connect('http://quotrweb-littlestory.rhcloud.com:8000', {'forceNew':true});
  reddleHelperObj = new reddleHelper(socket);

  prepareUIElements();
});

