const jwt = require("jsonwebtoken");

/**
 * Generates a JWT token for authenticated users
 * @param {String} userId - MongoDB User ID
 * @returns {String} JWT Token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });
};

module.exports = generateToken;
