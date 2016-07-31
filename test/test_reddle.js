var assert = require('chai').assert;
var reddle = require('../modules/reddle');
var constants = require('../constants');
var redisHelper = require('../modules/redisHelper');

/* Configure test env */
var webTestTimeout = 10000; // Seconds for test timeout if a web request is involved
reddle.connect({host:constants.REDIS_HOST, port:constants.REDIS_PORT});
redisHelper.connect({host:constants.REDIS_HOST, port:constants.REDIS_PORT});

/* Test Data */
    
describe('reddle.js', function(){
  describe('getServerInfo', function(){
	this.timeout(webTestTimeout);
	  
    it('should be able to get the server info', function(done){
      reddle.getServerInfo(function (err, serverInfo) {
		assert.isNull(err);
        assert.isNotNull(serverInfo);
        //console.log(JSON.stringify(serverInfo)); 
        done(); // Mark test complete
      });
    });
    
    it('should be able to get the latest server info', function(done){
      reddle.getServerInfo(function (err, serverInfo) {
        assert.isNotNull(serverInfo);
        var keys = serverInfo.databases[0].keys; 
      
        redisHelper.addObjectToCache('alpha'+(new Date()), 'abc', function() {
		  reddle.getServerInfo(function (err, serverInfo2) {
            assert.isNotNull(serverInfo2);
            var keys2 = serverInfo2.databases[0].keys; 
            assert.isTrue(keys < keys2);
            done(); // Mark test complete
	      });
        });
      });
    });
  });

  describe('subscribe', function(){
	this.timeout(webTestTimeout);
	  
    it('should get periodic counters from the server by subscribing', function(done){
      var callCounter = 0;

      reddle.setRefreshTime(1000);
      // No need
      //reddle.startCollection();
      
      reddle.subscribe('used_memory', function (data) {
        assert.isNotNull(data);
        assert.isNotNull(data.attribute);
        assert.isNotNull(data.value);
        assert.isNotNaN(parseInt(data.value));
        assert.isNotNull(data.timestamp);

        console.log('INFO: ' +
                    data.attribute+' = ' + data.value +
                    ' -- at ' + data.timestamp);
        
        callCounter++;
        // make sure repeated info is passed to us as subscription listener
        if (callCounter >= 3)
        { 
          reddle.stopCollection();
          done(); // Mark test complete
        }
      });
      
    });
  });
});

