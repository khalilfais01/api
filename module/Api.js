const mongoose = require('mongoose');

const APISchema = new mongoose.Schema({
  username: {
    type: String,
  },
  token: {
    type: String
  },
  secret: {
    type: String
  }
});
const Api = mongoose.model('api', APISchema);
module.exports = Api;
