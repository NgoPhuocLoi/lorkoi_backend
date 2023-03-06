require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();

// apply middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// initiate database
require("./dbs/mongodb.init");

app.get("/", (req, res) => {
  res.json({ message: "Hello" });
});

module.exports = app;
