require('dotenv').config();

const { SESSION_USER_SECRET, SESSION_USER_ALIVE } = process.env;

const session = require('express-session');
const FileStore = require('session-file-store')(session);

const sessionConfig = {
  name: 'refToken',
  store: new FileStore(),
  secret: SESSION_USER_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: Number(SESSION_USER_ALIVE),
    httpOnly: true,
  },
};

module.exports = sessionConfig;
