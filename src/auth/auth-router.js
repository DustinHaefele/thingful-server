const express = require('express');
// const path = require('path');
const AuthService = require('./auth-service');
// const { requireAuth } = require('../middleware/basic-auth');

const jsonBodyParser = express.json();

const AuthRouter = express.Router();

AuthRouter.route('/').post(jsonBodyParser, (req, res, next) => {
  const { user_name, password } = req.body;
  const user = { user_name, password };

  if (!user_name || !password) {
    return res.status(400).json({
      error: `Missing Credentials`
    });
  }

  AuthService.getUserWithUserName(req.app.get('db'), user_name).then(user => {
    if (!user) {
      return res.status(401).json({
        error: `Invalid Credentials`
      });
    }

    AuthService.verifyPassword(password, user.password).then(match => {
      if (!match) {
        return res.status(401).json({
          error: `Invalid Credentials`
        });
      }
      res.send('jwt token');
    });
  }).catch(next);

  
  
});

module.exports = AuthRouter;
