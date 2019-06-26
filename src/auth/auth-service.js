const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

const AuthService = {
  getUserWithUserName(db, user_name) {
    return db('thingful_users')
      .where({ user_name })
      .first();
  },

  verifyPassword(password, hashedPass){
    return bcrypt.compare(password, hashedPass);
  },

  createJwt(sub, pay) {
    return jwt.sign(pay, config.JWT_SECRET, {
      subject: sub
    });
  }
};

module.exports = AuthService;