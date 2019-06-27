const express = require('express');
const path = require('path');
const UsersService = require('./user-service');

const UsersRouter = express.Router();
const jsonbodyParser = express.json();

UsersRouter.post('/', jsonbodyParser, (req, res, next) => {
  const { user_name, nick_name, password, full_name } = req.body;
  const user = { user_name, nickname: nick_name, password, full_name };

  const passError = UsersService.validatePassword(password);

  if (passError) {
    return res.status(400).json({ error: passError });
  }

  UsersService.validateUserName(req.app.get('db'), user_name).then(
    userMatchError => {

      if (userMatchError) {
        return res.status(400).send({ error: 'Username already exists' });
      }
      return UsersService.hashPassword(password).then(hashedPass => {
        const newUser = {
          user_name,
          full_name,
          nickname: nick_name,
          password: hashedPass
        };
        return UsersService.insertUser(req.app.get('db'), newUser).then(
          user => {
            return res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${user.id}`))
              .json(UsersService.serializedUser(user));
          }
        );
      });
    }
  ).catch(next);
});

module.exports = UsersRouter;
