const AuthServices = require('../auth/auth-service');

console.log(AuthServices);

function requireAuth(req, res, next) {
  
  const authToken = req.get('Authorization') || '';
  let token;

  if (!authToken.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  } else{
    token = authToken.slice(7, authToken.length);
  } 

  try {
    console.log('decoded:', token);
    const decoded = AuthServices.verifyJwt(token);
    
    AuthServices.getUserWithUserName(req.app.get('db'), decoded.subject)
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Unauthorized request' });
        }
        req.user = user;
        next();
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  } catch (err) {
    res.status(401, { error: 'Unauthorized request' });
  }
}

module.exports = {
  requireAuth
};
