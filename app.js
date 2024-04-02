const bodyParser = require("body-parser");
const express = require("express");
const { default: mongoose } = require("mongoose");
const userRoute = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/users", userRoute);

app.use((req, res, next) => {
  const error = new HttpError("Unsupported route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occured" });
});

mongoose
  .connect(
    "mongodb+srv://mharoon2595:Zvdr8tinvKUvhOQF@cluster0.inzlklw.mongodb.net/credMERN?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to server!");
    app.listen(8000);
  })
  .catch((err) => {
    console.log(err);
  });
