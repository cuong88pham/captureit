var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'server'
    },
    port: 3000,
    db: 'mongodb://localhost/captit',
    secret: '123123131'
  },

  test: {
    root: rootPath,
    app: {
      name: 'server'
    },
    port: 3000,
    db: 'mongodb://localhost/server-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'server'
    },
    port: 3000,
    db: 'mongodb://localhost/server-production',
    secret: ''
  }
};

module.exports = config[env];
