module.exports.controller = function(app) {
'use strict';

/*
 * Requires.
 */
var isDev = app.get('isDev');
var util = require('../util.js'),
    conf = app.get('conf');
var mUser = require('../models/user.js');


/*
 * Controllers.
 */
app.get('/', function(req, res) {
  if (isDev) { util.dumper(req); }
  var context = util.getContext(req);

  res.render('index', {
    c: context
  });
});


app.get('/login', function(req, res) {
  if (isDev) { util.dumper(req); }
  var context = util.getContext(req);

  if (context.isLoggedIn) { res.redirect('/'); }

  res.render('login', {
    c: context
  });
});


app.post('/login', function(req, res) {
  if (isDev) { util.dumper(req); }
  var context = util.getContext(req);

  if (context.isLoggedIn) { res.redirect('/'); }

  req.assert('id', 'ID_EMPTY').notEmpty();
  req.assert('id', 'ID_INVALID').len(4, 16).isAlphanumeric();
  req.assert('password', 'PW_EMPTY').notEmpty();
  req.assert('password', 'PW_INVALID').len(4, 16).isAlphanumeric();
  var errors = req.validationErrors();

  if (errors) {
    if (isDev) { console.log('Form error.'); }

    return res.render('login', {
      c: context,
      error: conf.validationErrors[errors[0].msg]
    });
  }

  var query = {
    id: req.body.id,
    password: util.sha256sum(req.body.password)
  };

  if (isDev) { console.log('Try to login by', query); }
  mUser.findOne(query, function(err, data) {

    if(err) {
      if (isDev) { console.log(err); }

      return res.render('login', {
        c: context,
        error: conf.databaseErrors['ERROR']
      });
    }

    if(data) {
      if (isDev) { console.log('Logged in.'); }

      req.session.user = data._id;

      return res.redirect('/');

    } else {
      if (isDev) { console.log('No data!'); }

      return res.render('login', {
        c: context,
        error: conf.databaseErrors['NO_DATA']
      });
    }
  });
});


app.get('/logout', function(req, res) {
  if (isDev) { util.dumper(req); }
  var context = util.getContext(req);
  if (!context.isLoggedIn) { res.redirect('/'); }

  delete req.session.user;
  req.session.destroy();

  res.render('logout', {
    c: context
  });
});


app.get('/register', function(req, res) {
  if (isDev) { util.dumper(req); }
  var context = util.getContext(req);

  res.render('register', {
    c: context
  });
});


app.post('/register', function(req, res) {
  if (isDev) { util.dumper(req); }
  var context = util.getContext(req);

  req.assert('id', 'ID_EMPTY').notEmpty();
  req.assert('id', 'ID_INVALID').len(4, 16).isAlphanumeric();
  req.assert('password', 'PW_EMPTY').notEmpty();
  req.assert('password', 'PW_INVALID').len(4, 16).isAlphanumeric();
  var errors = req.validationErrors();

  if (errors) {
    if (isDev) { console.log('Form error.'); }

    return res.render('register', {
      error: conf.validationErrors[errors[0].msg]
    });
  }

  var query = {
    id: req.body.id,
    password: util.sha256sum(req.body.password)
  };

  var user = new mUser(query);

  if (isDev) { console.log('Try to register by', query); }
  user.save(function(err, data) {
    if(err) {
      if (isDev) { console.log(err); }

      var errTxt = '';
      switch (err.code) {
      case 11000:
        errTxt = conf.databaseErrors[11000];
        break;
      default:
        errTxt = conf.databaseErrors['ERROR'];
        break;
      }

      return res.render('register', {
        c: context,
        error: errTxt
      });
    }

    if (isDev) { console.log('Registered user', query); }
    if (isDev) { console.log(data); }

    req.session.user = data._id;

    return res.redirect('/');
  });
});

};
