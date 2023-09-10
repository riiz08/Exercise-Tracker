require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const paramsMongoose = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(
  "mongodb+srv://mhmdrizki0812:ZzQRKgduxByfa4uo@cluster0.cfbamuv.mongodb.net/?retryWrites=true&w=majority",
  paramsMongoose
);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

app.post("/api/users", async (req, res) => {
  const username = req.body.username;

  const newUser = await new User({
    username: username,
  });
  try {
    newUser.save();
    res.json(newUser);
  } catch (err) {
    res.json(err);
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const getAllUser = await User.find();
    res.json(getAllUser);
  } catch (err) {
    res.json(err);
  }
});


app.post('/api/users/:_id/exercises', async (req, res) => {
  
  try {
    
  } catch (err) {
    
  }
})

app.get('/api/users/:_id/logs', async (req, res) => {
  
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
