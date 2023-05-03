// Import required modules
const mongoose = require('mongoose');
const express = require("express");
const bodyParser = require('body-parser');
const app = express();

// Import configuration and routes
const db = require('./config/keys').mongoURI;
const users = require("./routes/api/users");
const tweets = require("./routes/api/tweets");

// Configure body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch(err => console.log(err));

// Define a test route
app.get("/", (req, res) => res.send("Hello World"));

// Use imported routes
app.use("/api/users", users);
app.use("/api/tweets", tweets);

// Set up server to listen on specified port
const port = process.env.PORT || 5002;
app.listen(port, () => console.log(`Server is running on port ${port}`));
