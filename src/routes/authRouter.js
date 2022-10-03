const express = require('express');

const Services = require('../services');

const router = express.Router();

router.route('/login')
  .post(Services.Authorization.login);

router.route('/logout')
  .post(Services.Authorization.logout);

router.route('/reauth')
  .get(
    Services.Connections.shouldHaveRefTokenMiddleware,
    Services.Authorization.refreshAuthorization,
  );

module.exports = router;
