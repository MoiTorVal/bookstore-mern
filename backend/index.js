import express from "express";
import { PORT, mongoDB } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

// Route for save a new Book
app.post("/books", async (req, res) => {
  try {
    if (!req.body.title || !req.body.publishYear || !req.body.author) {
      return res.status(400).send("Missing required fields");
    }
    const newBook = {
      title: req.body.title,
      author: req.body.author,
      publishYear: req.body.publishYear,
    };

    const book = await Book.create(newBook);
    return res.status(201).send(book);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
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
