;(function() {
'use strict';

/*
 * Module dependencies.
 */
var express = require('express'),
    app = module.exports = express();
var ConnectMongo = require('connect-mongo')(express),
    mongoose = require('mongoose');
var expressValidator = require('express-validator');

var hbs = require('hbs');
var fs = require('fs');


/*
 * App settings.
 */
app.configure('development', function(){
  app.set('isDev', true);
  app.set('view cache', false);
  app.use(express.errorHandler({ showStack: true, dumpExceptions: true }));
  app.use(express.logger('dev'));
});

app.configure('production', function(){
  app.set('view cache', true);
});

var conf = require('config');
app.set('conf', conf);
var isDev = app.get('isDev');
if (isDev) { console.log('Env is development ?', isDev); }

app.configure(function(){
  app.use(expressValidator());

  // Use Mongodb for session store.
  app.use(express.cookieParser());
  app.use(express.urlencoded());
  app.use(express.json());
  app.use(express.session({
    secret: 'userSession',
    store: new ConnectMongo({
      db: conf.dbName
    })
  }));

  // DataBase
  mongoose.connect('mongodb://localhost/' + conf.dbName);
  if (isDev) { console.log('Use db: %s for session and data store', conf.dbName); }

  // Use Handlebars as view engine.
  app.set('view engine', 'html');
  app.engine('html', hbs.__express);

  // And load all partials.
  fs.readdirSync(conf.partialsDir).forEach(function(fileName) {
    var matches = /^([^.]+).html$/.exec(fileName);
    if (!matches) { return; }

    var name = matches[1],
        template = fs.readFileSync(conf.partialsDir + '/' + fileName, 'utf8');
    hbs.registerPartial(name, template);
    if (isDev) { console.log('Partial: %s loaded', name); }
  });

  // Settings about Routes/Controllers.
  app.use(app.router);

  fs.readdirSync(conf.controllersDir).forEach(function(fileName) {
    var matches = /^([^.]+).js$/.exec(fileName);
    if (!matches) { return; }

    require(conf.controllersDir + '/' + fileName).controller(app);
    if (isDev) { console.log('Controller: %s loaded', fileName); }
  });
});


/*
 * App start.
 */
app.listen(conf.port);
if (isDev) { console.log('Express server start listening on port ' + conf.port); }

}(this.self || global));
