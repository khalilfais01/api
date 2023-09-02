const express = require('express');
const router = express.Router();
const authenticate = require('./authMiddleware'); 

router.post('/', (req, res) => {
  res.json({ message: 'api' });
});

router.get('/users', authenticate, (req, res) => {
  const users = []; 
  res.json(users);
});

module.exports = router; // Export the router