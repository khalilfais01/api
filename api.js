require('dotenv').config();
const express = require("express")
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");

const crypto = require('crypto');

const app = express();


app.use(cors());
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies


const Api = require('./module/Api.js')

const PORT = process.env.PORT
const PASSWORD = process.env.PASSWORD

const APP = `mongodb+srv://khalildjaariri:${PASSWORD}@cluster0.0hax3fp.mongodb.net/?retryWrites=true&w=majority`



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


// ###################################################################################

app.get('/test', (req, res) => {
  res.json({message:'Working'})
})

app.post('/createToken', async (req, res) => {
  const username = req.body.username;

  try {
    const existingUser = await Api.findOne({ username });

    if (!existingUser) {
      res.json({ error: 'User not found' })
      return;
    }

    if (!existingUser.token) {
      const randomSecret = crypto.randomBytes(32).toString('hex');
      const randomToken = crypto.randomBytes(32).toString('hex');

      const updatedUser = await Api.findOneAndUpdate(
        { username: username },
        { token: randomToken, secret: randomSecret },
        { new: true }
      );

      console.log('Updated user:', updatedUser);
      res.json({ token: randomToken, secret: randomSecret, username: username });
    } else {
      res.json({ token: existingUser.token, secret: existingUser.secret, username });
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/register', async (req, res) => {
  const username = req.body.username;

  const existingUser = await Api.findOne({ username });
  if (existingUser) {
    return res.json({ error: 'Username is already in use.' });
  }
  const user = new Api({ username });
  await user.save();

  res.json({ message: 'User registered successfully.' });
});

// ###################################################################################



app.listen(PORT, () => {
    console.log(`Server is running on port https://localhost:${PORT}`);
});
