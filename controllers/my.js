module.exports.controller = function(app) {
'use strict';

/*
 * Requires.
 */
var isDev = app.get('isDev');
var util = require('../util.js'),
    conf = app.get('conf');


/*
 * Controllers.
 */
app.get('/my/', function(req, res) {
  if (isDev) { util.dumper(req); }
  var context = util.getContext(req);

  if (!context.isLoggedIn) { res.redirect('/'); }

  res.render('my/index', {
    c: context
  });
});


app.get('/my/upload', function(req, res) {
  if (isDev) { util.dumper(req); }
  var context = util.getContext(req);

  if (!context.isLoggedIn) { res.redirect('/'); }

  res.render('my/upload', {
    c: context
  });
});


};
