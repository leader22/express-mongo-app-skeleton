module.exports = (function(app) {
'use strict';


return {
  sha256sum: function(arg) {
    var sha256 = require('crypto').createHash('sha256');
    sha256.update(arg);
    return sha256.digest('hex');
  },

  dumper: function(req) {
    console.log('Dumper-------------------------<');
    console.log('Req:' + req.route.path + '[' + req.route.method + ']');
    console.log('isLoggedIn:', !!req.session.user);
    console.log('Session:', req.session);
  },

  getContext: function(req) {
    var session = req.session;

    return {
      isLoggedIn: !!session.user,
      token: session.user
    }
  }
};

}());
