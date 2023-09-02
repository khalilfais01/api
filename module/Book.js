const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  password: {
    type: String
  }
}, {collection: 'books'});
const Book = mongoose.model('books', BookSchema);
module.exports = Book;
