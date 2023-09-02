require('dotenv').config();
const express = require("express")
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();
const Book = require('./module/Book.js')

const PORT = process.env.PORT
const PASSWORD = process.env.PASSWORD
const APP = `mongodb+srv://khalildjaariri:${PASSWORD}@cluster0.0hax3fp.mongodb.net/?retryWrites=true&w=majority`


// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImtoYWxpbGZhaXMxIiwiaWF0IjoxNjkzNDY5OTQwfQ.VBcQYJ0UNfS41Jv97jBH464pfeuudKMpyjxovkccTxE

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(APP, {
      useNewUrlParser: true,
    });

    console.log('MongoDB is Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();


app.get('/test', (req, res) => {
    res.json({ message: 'Test' });
});

app.get('/post', (req, res) => {
  res.json({message:'Push Data AS Post Request'})
})


app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await Book.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: 'Username is already in use.' });
  }
  const user = new Book({ username, password });
  await user.save();

  res.json({ message: 'User registered successfully.' });
});
///////////////////////////////////////////////////////////////
function authenticateToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token is invalid or expired.' });
    }
    req.user = user;
    next();
  });
}

// POST route for user login and token generation
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Book.findOne({ username, password });

    if (!user) {
      return res.status(403).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign({ username: user.username }, process.env.SECRET, { expiresIn: '5s' });
    res.json({ accessToken: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET route to retrieve user data using the token
app.get('/user', authenticateToken, async (req, res) => {
  try {
    const user = await Book.findOne({ username: req.user.username });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Return user data as needed
    res.json({ username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
////////////////////////////////////////////////////////////////////
app.post('/post', (req, res) => {
  const title = req.body.title
  const description = req.body.description
  if (!description) {
    res.json({message:"Title Or description As empty"})
    console.log({message:"Title Or description As empty"})
  }else{
    const book = new Book({
      title:title,
      description:description,
    });
    book.save()
      .then(data => {
        res.json(data)
        console.log(data);
    })
  }
});
app.post('/remove', (req, res) => {
  const id = req.body.id // IDEA: GET ID FROM REQUEST POST
  Book.deleteOne({_id: id})
  .then(res.json({'message':true}))
})
app.get('/remove/all', (req, res) => {
  const id = req.body.id // IDEA: GET ID FROM REQUEST POST
  Book.deleteOne()
  .then(res.json({'message':true}))
})


app.get('/get', (req, res) => {
    Book.find()
    .then(data => {
      res.send(data)
      console.log(data)
    })
  // Book.find()
  //   .then(books => res.json(books))
  //   .catch(err => res.status().json({ nobooksfound: 'No Books found' }));
});

app.listen(PORT, () => {
    console.log(`Server is running on port https://localhost:${PORT}`);
});
