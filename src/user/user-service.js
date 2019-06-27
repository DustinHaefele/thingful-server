const REGEX_PASS = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UsersService = {
  validatePassword(password) {
    
    if(password.length < 8){
      return  'Password must be at least 8 characters';
    }
    if(password.length > 72){
      return 'Password must be less than 73 characters';
    }
    if(password[0] === ' ' || password[password.length - 1] === ' '){
      return 'Password can\'t start or end with a space';
    }
    if(!REGEX_PASS.test(password)){
      return 'Password must contain 1 number 1 lowercase letter 1 capital letter and 1 special symbol';
    }

    return null;
  },

};

module.exports = UsersService;