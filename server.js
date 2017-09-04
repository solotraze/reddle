#!/bin/env node
//  OpenShift Node application
var express = require('express');
var expressApp = express();
var server = require('http').Server(expressApp);
var socketio = require('socket.io', { transports: ['websocket']})(server);
var fs = require('fs');
var bodyParser = require('body-parser'); // To parse POST parameters

var routes = require('./routes');
var reddleSockets = require('./modules/reddleSockets');

/**
 *  Define the application.
 */
var webApp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
      //  Set the environment variables we need.
      self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
      self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

      if (typeof self.ipaddress === "undefined") {
        //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
        //  allows us to run/test the app locally.
        console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
        self.ipaddress = "127.0.0.1";
        //self.ipaddress = "192.168.187.93";
      };
    };



    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        //  Add handlers for the app (from the routes).
        for (var r in routes.getRoutes) {
            self.app.get(r, routes.getRoutes[r]);
        }
        for (var r in routes.postRoutes) {
            self.app.post(r, routes.postRoutes[r]);
        }
        // Map static content folder
        self.app.use('/dist', express.static('dist'));
        self.app.use('/', express.static('html'));
    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
      self.app = expressApp;
      self.appServer = server;
      self.io = socketio;

      self.app.use(bodyParser.json()); // request will need header "Content-Type: application/json"
      self.app.use(bodyParser.urlencoded({ extended: true }));

      self.createRoutes();
      reddleSockets.bindSocket(self.io);
    };


    /**
     *  Initializes the application.
     */
    self.initialize = function() {
        self.setupVariables();
        routes.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.appServer.listen(self.port, self.ipaddress, function() {

            reddleSockets.start();
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Application.  */



/**
 *  main():  Main code.
 */
var zapp = new webApp();
zapp.initialize();
zapp.start();

