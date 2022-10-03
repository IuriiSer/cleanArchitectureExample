function isMinimumProfile(data) {
  if (!data.nickname) return false;
  if (!data.email) return false;
  if (!data.password) return false;
  return true;
}

module.exports = isMinimumProfile;
