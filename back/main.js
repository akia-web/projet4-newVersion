import express from "express";
import mongoose from "mongoose";
import { accountRouter } from "./Controllers/AccountController.js";
import { imageRouter } from "./Controllers/ImageController.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

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
// mongoose
//   .connect("mongodb://localhost:27017/account-projet4-express")
//   .then(() => console.log("Connected to MongoDB database"))
//   .catch((error) =>
//     console.log("Error connecting to MongoDB database: ", error)
//   );

mongoose
  .connect(
    "mongodb+srv://charline:Charline123@cluster0.o5elyoa.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connecté à la base de données MongoDB"))
  .catch((erreur) =>
    console.log(
      "Erreur lors de la connexion à la base de données MongoDB : ",
      erreur
    )
  );

// Start the Express server
app.listen(PORT, () => {
  console.log("Server listening on port 3001");
});

app.use("/", accountRouter);
app.use("/", imageRouter);
