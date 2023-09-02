const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate a random secret (e.g., 256 bits or 32 bytes)
const randomSecret = crypto.randomBytes(32).toString('hex');

// Payload (data you want to include in the token)
const payload = { user: 'exampleuser' };

// Sign the JWT using the random secret
const token = jwt.sign(payload, randomSecret);

console.log('Random Secret:', randomSecret);
console.log('Generated JWT:', token);
