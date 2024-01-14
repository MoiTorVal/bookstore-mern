import express from "express";
import mongoose from "mongoose";
import { PORT, mongoDB } from "./config.js";
import bookRoutes from "./routes/booksRoutes.js";
import cors from "cors";

const app = express();

app.use(express.json());

// Middleware for handling CORS
// Allow all Origins with Default of cors(*)
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.use("/books", bookRoutes);

mongoose
  .connect(mongoDB)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => err.message);
