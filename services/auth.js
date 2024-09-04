const JWT = require("jsonwebtoken");

const secrete = "#m@n$!";

function createToken(user) {
  const payload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    profileprofilePhotoURL: user.profilePhotoURL,
    role: user.role,
  };

  const token = JWT.sign(payload, secrete);
  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, secrete);

  return payload;
}

module.exports = {
  createToken,
  validateToken,
};
