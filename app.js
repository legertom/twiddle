const mongoose = require('mongoose')
const express = require("express");
const app = express();
const db =  require('./config/keys').mongoURI;
const bodyParser = require('body-parser');

mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch(err => console.log(err))


app.get("/", (req, res) => res.send("Hello World"));

const port = process.env.PORT || 5002;

app.listen(port, () => console.log(`Server is running on port ${port}`));

const users = require("./routes/api/users");
const tweets = require("./routes/api/tweets");

app.use("/api/users", users);
app.use("/api/tweets", tweets);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());