const ROLE_ADMIN = require('./constants').ROLE_ADMIN;
const ROLE_EXPERT = require('./constants').ROLE_EXPERT;
const ROLE_USER = require('./constants').ROLE_USER;

// Set user info from request
exports.setUserInfo = function setUserInfo(request) {
  const getUserInfo = {
    _id: request._id,
    firstName: request.profile.firstName,
    lastName: request.profile.lastName,
    email: request.email,
    slug: request.slug,
    role: request.role
  };

  return getUserInfo;
};

exports.getRole = function getRole(checkRole) {
  let role;

  switch (checkRole) {
    case ROLE_USER: role = 3; break;
    case ROLE_EXPERT: role = 2; break;
    case ROLE_ADMIN: role = 1; break;
    default: role = 1;
  }

  return role;
};
