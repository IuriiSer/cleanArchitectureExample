const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

const express = require('express');

const app = express();

const cors = require('cors');
const logger = require('morgan');
const session = require('express-session');
const sessionConfig = require('./configs/sessionConfig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(session(sessionConfig));

const ConnectionsService = require('./services/ConnectionsService');
const routes = require('./routes');

app.use(ConnectionsService.initClientConnectionMiddleware);
app.use('/api/v1', routes.profile);
app.use('/api/v1', routes.event);
app.use('/api/v1', routes.authorization);

const rewievsRouter = require('./routes/rewievRouter');

app.use(rewievsRouter);

const api404Handler = require('./middlewares/api404Handler');
const erorHandler = require('./middlewares/errorHandler');

app.use(api404Handler);
app.use(erorHandler);

const dbConnectionCheck = require('../db/dbConnectionCheck');
const ChatServer = require('./server/ChatServer');

const PORT = process.env.NODE_ENV === 'production'
  ? process.env.PROD_PORT
  : process.env.DEV_PORT;

dbConnectionCheck().then(() => {
  const httpServer = app.listen(PORT);
  ChatServer.initChatServer(app, httpServer);
  console.log('server -> started');
});
