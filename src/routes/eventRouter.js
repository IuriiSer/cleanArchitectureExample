const express = require('express');

const EventService = require('../services/EventService');

const router = express.Router();

router.route('/event')
  .post(EventService.create)
  .put(EventService.update)
  .delete(EventService.setUnActive);

router.route('/events/:uuid')
  .get(EventService.getFullApi);

router.route('/events')
  .get(EventService.getFiltered);

router.route('/events/subscribe/:uuid')
  .get(EventService.subscribe);

router.route('/events/unsubscribe/:uuid')
  .get(EventService.unSubscribe);

module.exports = router;
