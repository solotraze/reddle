var assert = require('chai').assert;
var reddle = require('../modules/reddle');

/* Configure test env */
var webTestTimeout = 10000; // Seconds for test timeout if a web request is involved
/* Test Data */

describe('reddle.js', function(){
  describe('getServerInfo', function(){
    it('should be able to get the server info', function(done){
      this.timeout(webTestTimeout);
      var serverInfo = reddle.getServerInfo(); 
      assert.isNotNull(serverInfo);
      console.log(JSON.stringify(serverInfo)); 
      done(); // Mark test complete
    });
  });
});

