const Api = require('./module/Api.js'); 

async function authenticate(req, res, next) {
  const { token, secret } = req.headers;

  if (!token || !secret) {
    return res.json({ error: 'Authentication failed.' });
  }

  try {
    const existingToken = await Api.findOne({ token });

    if (existingToken) {
      if (existingToken.secret == secret) {
        req.user = existingToken;
        next();
      } else {
        res.json({ error: 'Token Or Secret Invalid' });
      }
    }else{
      res.json({error:' Token Error'})
    }
  } catch (error) {
    return res.json({ error: 'Authentication failed. Invalid token or secret.' });
  }
}

module.exports = authenticate; // Export the middleware function