var fs          = require('fs');

var zcache, cache_get;
/* routing table entries */
var getRoutes = { };
var postRoutes = { };

/**
 *  Create the routing table entries + handlers for the application.
 */

/**
 *  Populate the cache.
 */
populateCache = function() {
    if (typeof zcache === "undefined") {
      zcache = { 'index.html': '' };
    }

    //  Local cache for static content.
    zcache['index.html'] = fs.readFileSync('./html/index.html');
};


/**
 *  Retrieve entry (content) from cache.
 *  @param {string} key  Key identifying content to retrieve from cache.
 */
cache_get = function(key) { return zcache[key]; };

/********************************/
/* Pages						*/
/********************************/
/* Home page */
getRoutes['/'] = function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.send(cache_get('index.html') );
};

/********************************/
/* GET Services				*/
/********************************/
/*
getRoutes['/api/users'] = function(req, res) {
  //var url = req.query.targeturl;
  var userFullName = 'solo tr';
  var returnObj = { userFullName: userFullName };
  res.setHeader('Content-Type', 'application/json');
  res.send(returnObj);
};
*/

/********************************/
/* POST Services				*/
/********************************/

/* Create a new comment */
/*
postRoutes['/api/comments'] = function(req, res) {
  console.log('Request recieved for new comment.');
  console.log(req.body.authorName + ':' + req.body.content);

  var comment = { authorName: req.body.authorName, content: req.body.content };
  // store in DB
  comments.add(comment, function(err) {
    if (!err) {
      // Return success
      res.sendStatus(200);
    }
    else {
      // Return failure
      res.sendStatus(500);
    }
  });
};
*/

/* Public properties */
exports.getRoutes = getRoutes;
exports.postRoutes = postRoutes;
exports.populateCache = populateCache;
