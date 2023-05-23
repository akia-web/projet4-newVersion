import express from "express";
import mongoose from "mongoose";
import { accountRouter } from "./Controllers/AccountController.js";
import { imageRouter } from "./Controllers/ImageController.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

// Connect to the MongoDB database
mongoose
  .connect("mongodb://localhost:27017/account-projet4-express")
  .then(() => console.log("Connected to MongoDB database"))
  .catch((error) =>
    console.log("Error connecting to MongoDB database: ", error)
  );

// Start the Express server
app.listen(PORT, () => {
  console.log("Server listening on port 3000");
});

app.use("/", accountRouter);
app.use("/", imageRouter);
