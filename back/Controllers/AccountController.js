import express from "express";
import { AccountDto } from "../models/accountDto.js";
import { imageDto } from "../models/imageDto.js";
import { genSalt, hash, compare } from "bcrypt";
import { model } from "mongoose";
import jwt from "jsonwebtoken";
import fs from "fs";
import { getUserId } from "../functions/token.js";
const accountRouter = express.Router();

const Account = model("Account", AccountDto);
const ImageUser = model("imageUser", imageDto);

accountRouter.post("/account", async (request, response) => {
  try {
    const { email, password } = request.body;

    const existAccount = await Account.find({ email: email });

    if (existAccount.length > 0) {
      response.status(403).send("Compte déjà créé");
    } else {
      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);

      const account = new Account({ email, password: hashedPassword });
      await account.save();

      response.status(201).send("Compte créé");
    }
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .send("Une erreur est survenue lors de la création du compte");
  }
});

accountRouter.post("/login", async (request, reply) => {
  const { email, password } = request.body;
  try {
    // Vérification de l'email et du mot de passe

    const user = await Account.findOne({ email });

    if (!user) {
      throw new Error("Email ou mot de passe incorrect");
    }

    const validPassword = await compare(password, user.password);

    if (!validPassword) {
      throw new Error("Email ou mot de passe incorrect");
    }

    // Si les informations d'identification sont valides, créer le jeton JWT

    const token = jwt.sign(
      { userId: user._id },

      "16UQLq1HZ3CNwhvgrarV6pMoA2CDjb4tyF",

      {
        expiresIn: "1h",
      }
    );
    reply.status(200).send({ token });
  } catch (error) {
    console.log(error);
    reply.status(401).send("Identifiants invalides");
  }
});

accountRouter.delete("/account", async (request, reply) => {
  const userId = getUserId(request);
  if (!userId) {
    return reply.status(403).send("Authentification invalide");
  }

  try {
    const userAccount = await Account.findById(userId);

    if (!userAccount) {
      return reply.status(404).send("Compte non trouvé");
    }

    await Account.findByIdAndDelete(userId);

    const imagesAccount = await ImageUser.find({ userId: userId });
    imagesAccount.forEach(async (element) => {
      fs.unlink(element.name, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Le fichier a été supprimé avec succès");
      });

      await ImageUser.findByIdAndDelete(element.id);
    });
    reply.status(200).send("Compte supprimé avec succès !");
  } catch (error) {
    console.log(error);
    reply.status(401).send("Authentification invalide");
  }
});

accountRouter.get("/verify-token", async (request, reply) => {
  const userId = getUserId(request);
  if (!userId) {
    return reply.status(403).send({ response: "connexion refusée" });
  } else {
    return reply.status(200).send({ response: "connexion autorisée" });
  }
});

export { accountRouter };
