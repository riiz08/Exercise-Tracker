require("dotenv").config();

const express = require('express')
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));



const generatedId = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


const userStorage = new Map()
const userId = generatedId(1111111111, 99999999999);


app.post("/api/users", (req, res) => {
  const username = req.body.username;

  try {
    userStorage.set(username, userId)
    res.json({
      username,
      _id: userId
    })
  } catch (err) {
    res.json(err)
  }
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})