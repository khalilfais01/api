const Api = require('./module/Api.js'); 

async function authenticate(req, res, next) {
  const { token, secret } = req.headers;

  if (!token || !secret) {
    return res.status(401).json({ error: 'Authentication failed. Missing token or secret.' });
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
    }
  } catch (error) {
    return res.status(403).json({ error: 'Authentication failed. Invalid token or secret.' });
  }
}

module.exports = authenticate; // Export the middleware function