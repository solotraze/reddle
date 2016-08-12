/*** Constants ***/
var constantsList = {
  'REDIS_HOST': '192.168.187.154',//'127.0.0.1',/
  'REDIS_PORT': '6379',
  'REDDLE_DEFAULT_REFRESH_TIME': 1000,
  'DATA_PATH': process.env.OPENSHIFT_DATA_DIR || './data/',
  'LOGFILE_TRACE': 'trace.json',
  'LOGFILE_ERROR': 'exceptions.json'
};

function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

function defineAllConstants(constantsList) {
	for(var key in constantsList){
	    define(key,constantsList[key]);
	}
};

// Define all the constants
defineAllConstants(constantsList);

