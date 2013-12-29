module.exports = (function() {
'use strict';

return {
  port: 8463,
  partialsDir: __dirname + '/../views/partials',
  controllersDir: __dirname + '/../controllers',
  dbName: 'myApp',
  databaseErrors: {
    ERROR: 'Database error',
    NO_DATA: 'No data',
    11000: 'Already used'
  },
  validationErrors: {
    ID_EMPTY: 'ID is empty',
    ID_INVALID: 'ID is 4-16 characters and alphanumeric',
    PW_EMPTY: 'PW is empty',
    PW_INVALID: 'PW is 4-16 characters and alphanumeric',
  }
};


}());
