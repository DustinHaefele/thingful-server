

function requireAuth(req,res,next) {
 
  const authToken = req.get('Authorization') || '';

  if(!authToken.toLowerCase().startsWith('basic ')){
    return res.status(401).json({error: 'Missing token'});
  } 

  const [_, token] = authToken.split(' ');

  const [user_name, password] = Buffer
    .from(token, 'base64')
    .toString()
    .split(':');

  if (!user_name || !password) {
    return res.status(401).json({error: 'Unauthorized request'})
  }

  next();
}

module.exports = {
  requireAuth,
};