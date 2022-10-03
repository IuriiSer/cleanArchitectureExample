const express = require('express');

const RewievsService = require('../services/RewievsService');

const router = express.Router();

router.route('/rewiev')
  .get(RewievsService.getProfileFull);

module.exports = router;
