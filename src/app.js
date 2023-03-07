require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const { handleError } = require("./middlewares/handleError");
const ApiError = require("./utils/apiError");
const app = express();

// apply middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// initiate database
require("./dbs/mongodb.init");

// initiate router
app.use("/v1/api", require("./routes"));

// handle error
app.use((req, res, next) => {
  next(
    new ApiError(404, [
      {
        msg: "Not Found",
      },
    ])
  );
});
app.use(handleError);

module.exports = app;
