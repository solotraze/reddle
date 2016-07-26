var assert = require('chai').assert;
var redisHelper = require('../modules/redisHelper');
var constants = require('../constants');

/* Configure test env */
var webTestTimeout = 10000; // Seconds for test timeout if a web request is involved
/* Test Data */

describe('redisHelper.js', function(){
  describe('AddObjectToCache', function(){
    it('should be able to set and get an item to cache', function(done){
      this.timeout(webTestTimeout);

      redisHelper.connect({host:constants.REDIS_HOST, port:constants.REDIS_PORT});
      redisHelper.addObjectToCache('alpha', 'abc', function(err, data) {
        assert.isNull(err);
        
        redisHelper.getObjectFromCache('alpha', function (err, data) {
          assert.isNull(err);
          assert.isNotNull(data, 'Data returned was null');
          assert.equal(data, 'abc');
          done(); // Mark test complete
        });
      });

    });
  });
});

