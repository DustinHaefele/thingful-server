const express = require('express');
const UsersService = require('./user-service');

const UsersRouter = express.Router();
const jsonbodyParser = express.json();

UsersRouter.post('/', jsonbodyParser, (req, res, next) => {
  const { user_name, nick_name, password, full_name } = req.body;
  const user = { user_name, nickname: nick_name, password, full_name };

  const passError = UsersService.validatePassword(password);
    
  if(passError){
    return res.status(400).json({error: passError});
  }


  return res.send('ok');
});

module.exports = UsersRouter;
