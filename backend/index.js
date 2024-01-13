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
    // Creating a new book object from the request body
    const newBook = {
      title: req.body.title,
      author: req.body.author,
      publishYear: req.body.publishYear,
    };
    // Using 'await' with 'Book.create' to asynchronously create a new book
    const book = await Book.create(newBook);
    // Sending a successful response with a newly created book
    return res.status(201).send(book);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});

// Route for getting all books
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find({});

    return res.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});

// Route for getting one book
app.get("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    return res.status(200).json(book);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});

// Route for updating a book
app.put("/books/:id", async (req, res) => {
  try {
    if (!req.body.title || !req.body.publishYear || !req.body.author) {
      return res.status(400).send("Missing required fields");
    }

    const { id } = req.params;
    const result = await Book.findByIdAndUpdate(id, req.body);

    if (!result) {
      return res.status(404).send("Book not found");
    }

    return res.status(200).send("Book updated successfully");
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});

// Route for deleting a book
app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);

    if (deletedBook) {
      // Book deleted successfully, send it as a response
      return res
        .status(200)
        .json({ message: "Book deleted successfully", deletedBook });
    } else {
      // Book not found
      return res.status(404).send("Book not found");
    }
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
