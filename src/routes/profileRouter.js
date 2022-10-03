const express = require('express');

const ProfileService = require('../services/ProfileService');

const router = express.Router();

router.route('/create-profile')
  .get(ProfileService.createProfile);

router.route('/profile')
  .get(ProfileService.getProfileFull)
  .put(ProfileService.updateProfile)
  .delete(ProfileService.setProfileUnActive);

router.route('/profiles/:uuid')
  .get(ProfileService.getProfileShortApi);

module.exports = router;
