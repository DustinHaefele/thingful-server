const bcrypt = require('bcrypt');
const xss = require('xss');

const REGEX_PASS = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UsersService = {
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (password.length > 72) {
      return 'Password must be less than 73 characters';
    }
    if (password[0] === ' ' || password[password.length - 1] === ' ') {
      return "Password can't start or end with a space";
    }
    if (!REGEX_PASS.test(password)) {
      return 'password needs 1 special character, 1 uppercase letter, 1 lowercase letter, and 1 number';
    }

    return null;
  },

  validateUserName(db, user_name) {
    return db('thingful_users')
      .where({ user_name })
      .first()
      .then(userInDb => !!userInDb);
  },
  hashPassword(pass) {
    return bcrypt.hash(pass, 10);
  },
  insertUser(db,user){
    return db('thingful_users')
      .insert(user)
      .returning('*')
      .then(users=>users[0]);
  },
  serializedUser(user) {
    return {
      user_name: xss(user.user_name),
      full_name: xss(user.full_name),
      password: user.password,
      nickname: xss(user.nickname),
    };
  }
};

module.exports = UsersService;
