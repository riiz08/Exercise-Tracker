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

mongoose.connect(process.env.MONGO_URI, paramsMongoose);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

const exircisesSchema = new mongoose.Schema({
  username: {
    required: true,
    type: String,
  },
  description: String,
  duration: Number,
  date: String,
  _id: String,
});

const Exircises = mongoose.model("Exircises", exircisesSchema);

const logsSchema = new mongoose.Schema({
  username: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercises", // Merujuk ke koleksi Exercises
  },
  count: Number,
  _id: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercises", // Merujuk ke koleksi Exercises
  },
  log: [
    {
      description: String,
      duration: Number,
      date: String,
    },
  ],
});

const Logs = mongoose.model("Logs", logsSchema);


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

app.post("/api/users/:_id/exercises", async (req, res) => {
  let { description, duration, date, userId } = req.body;
  const query = await User.findOne({ _id: userId });
  const username = await query.username;

  if (date === "") date = new Date().toDateString();

  const newExircises = await new Exircises({
    username: username,
    description: description,
    duration: duration,
    date: date,
    _id: userId,
  });

  const newLogs = await new Logs({
    username: username,
    count: Logs.length,
    _id: userId,
    logs: [
      {
        description: description,
        duration: duration,
        date: date,
      },
    ],
  });

  const logsId = Logs.findOne({ _id: userId });
  try {
    newExircises.save();
    if (logsId._id == userId) {
    }
    res.json(newLogs);
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
});

app.get("/api/users/:_id/logs", async (req, res) => {
  try {
    const userId = req.params._id;
    const fromDate = req.query.from;
    const toDate = req.query.to;
    const limit = parseInt(req.query.limit) || 0; // Menggunakan parseInt untuk mengubah limit menjadi angka, atau default menjadi 0 jika tidak ada query limit

    // Query database untuk mencari latihan pengguna berdasarkan ID pengguna dan rentang tanggal (jika disediakan)
    const logsQuery = Logs.find({ _id: userId });
    if (fromDate) {
      logsQuery.where("date").gte(fromDate);
    }
    if (toDate) {
      logsQuery.where("date").lte(toDate);
    }
    if (limit > 0) {
      logsQuery.limit(limit);
    }

    const logs = await logsQuery.exec();

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
