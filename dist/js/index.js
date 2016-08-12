var socket;
var reddleHelperObj;
var reddleChartObj;
var refreshChartInterval;

function prepareUIElements() {
  $('#btnAction').click(onBtnActionClicked);
  $('#btnRemove').click(onBtnRemoveClicked);
  $('#btnClearClients').click(onBtnClearClientsClicked);
}

function loadNewChart(attribute) {
  clearChart();
  reddleChartObj = null;
  reddleChartObj = new reddleChart(attribute , 'values', $('#dvChartArea'), false, 5); 
  reddleChartObj.load();
}

function clearChart() {
  if (reddleChartObj != undefined) {
    reddleChartObj.clear();
  }
}

function updateChart(val, time) {
  if (reddleChartObj != undefined) {
    reddleChartObj.update(val, moment(time));
  }
}

function updatePage(data){
  $('#dvContent').html(data.attribute+' = '+data.value+' ('+data.timestamp+')');
  updateChart(data.value, data.timestamp);
}

function onBtnActionClicked() {
  var redisAttr = $('#txtAttribute').val();
  loadNewChart(redisAttr);
  reddleHelperObj.subscribeAttribute(redisAttr, updatePage);
}

function onBtnRemoveClicked() {
  var redisAttr = $('#txtAttribute').val();
  reddleHelperObj.unsubscribeAttribute(redisAttr);
  clearChart();
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

