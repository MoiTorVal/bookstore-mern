import express from "express";
import { PORT, mongoDB } from "./config.js";
import mongoose from "mongoose";

const app = express();

app.get("/", (req, res) => {
  console.log(req);
  res.status(200).send("Hello World!");
});

mongoose
  .connect(mongoDB)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => err.message);
