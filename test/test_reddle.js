var assert = require('chai').assert;
var reddle = require('../modules/reddle');
var constants = require('../constants');

/* Configure test env */
var webTestTimeout = 10000; // Seconds for test timeout if a web request is involved
/* Test Data */

describe('reddle.js', function(){
  describe('getServerInfo', function(){
    it('should be able to get the server info', function(done){
      this.timeout(webTestTimeout);

      reddle.connect({host:constants.REDIS_HOST, port:constants.REDIS_PORT});
      var serverInfo = reddle.getServerInfo(); 
      assert.isNotNull(serverInfo);
      console.log(JSON.stringify(serverInfo)); 
      done(); // Mark test complete
    });
  });
  describe('subscribe', function(){
    it('should be able to get the server info for a key by subscribing', function(done){
      this.timeout(webTestTimeout);

      reddle.connect({host:constants.REDIS_HOST, port:constants.REDIS_PORT});
      reddle.subscribe('used_memory', function (attribute, val) {
        console.log('Redis INFO: '+attribute+' = '+val);
        reddle.stopCollection();
        done(); // Mark test complete
      });
      reddle.startCollection();
    });
  });
});

