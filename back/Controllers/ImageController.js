import express from "express";
import { AccountDto } from "../models/accountDto.js";
import { imageDto } from "../models/imageDto.js";
import { model } from "mongoose";
import fs from "fs";
import { getUserId } from "../functions/token.js";
import { imgUpload } from "../functions/images.js";
import { generateRandomString } from "../functions/url.js";
const imageRouter = express.Router();

const Account = model("Account", AccountDto);
const ImageUser = model("imageUser", imageDto);

imageRouter.post("/images", imgUpload, async (request, reply) => {
  const userId = getUserId(request);
  if (!userId) {
    return reply.status(403).send("Authentification invalide");
  }

  const userAccount = await Account.findById(userId);
  if (!userAccount) {
    return reply.status(404).send("Compte non trouvé");
  }

  const name = `uploads/${request.file.filename}`;
  const date = Date();
  const isPublic = true;
  let url = generateRandomString();
  let isUrlExist = true;
  let urlExist = await ImageUser.find({ url: url });

  if (urlExist.length == 0) {
    isUrlExist = false;
  } else {
    while (isUrlExist) {
      url = generateRandomString();
      urlExist = await ImageUser.find({ url: url });
      if (urlExist.length == 0) {
        isUrlExist = false;
      }
    }
  }
  const newImage = new ImageUser({ date, name, isPublic, url, userId });
  await newImage.save();
  reply.status(201).send("image enregistré");
});

imageRouter.delete("/deleteImage/:imageId", async (request, reply) => {
  const userId = getUserId(request);
  if (!userId) {
    return reply.status(403).send("Authentification invalide");
  }
  try {
    const imageId = request.params.imageId;
    const searchimageUser = await ImageUser.findById(imageId);

    if (userId != searchimageUser.userId) {
      return reply.status(403).send("interdit de supprimer image");
    }
    fs.unlink(searchimageUser.name, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Le fichier a été supprimé avec succès");
    });
    const image = await ImageUser.findByIdAndDelete(imageId);

    if (!image) {
      return reply.status(404).send("Image non trouvée");
    }

    reply.status(200).send("Image supprimée avec succès !");
  } catch (error) {
    console.log(error);

    reply.status(401).send("Authentification invalide");
  }
});

imageRouter.get("/images", async (request, reply) => {
  try {
    const images = await ImageUser.find({ isPublic: true });
    const imageData = await Promise.all(
      images.map(async (image) => {
        return {
          id: image._id,
          name: image.name,
          date: image.date,
          isPublic: image.isPublic,
          url: image.url,
        };
      })
    );
    reply.send(imageData);
  } catch (error) {
    console.log(error);
    reply.status(500).send("Erreur serveur");
  }
});

imageRouter.get("/imagesUser", async (request, reply) => {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return reply.status(403).send({response: "Authentification invalide"});
    }

    const images = await ImageUser.find({ userId: userId });

    const imageData = await Promise.all(
      images.map(async (image) => {
        return {
          id: image._id,
          name: image.name,
          date: image.date,
          isPublic: image.isPublic,
          url: image.url,
        };
      })
    );

    reply.send(imageData);
  } catch (error) {
    console.log(error);
    reply.status(500).send({response:"Erreur serveur"});
  }
});

imageRouter.put("/images/:id", async (request, reply) => {
  try {
    const imageId = request.params.id;
    const userId = getUserId(request);
    if (!userId) {
      return reply.status(403).send("Authentification invalide");
    }

    const image = await ImageUser.findById(imageId);

    if (!image) {
      return reply.status(404).send("Image non trouvée");
    }

    if (image.userId !== userId) {
      return reply.status(403).send("Non autorisé à modifier cette image");
    }

    image.isPublic = !image.isPublic;

    await image.save();

    reply.send({
      id: image._id,
      name: image.name,
      date: image.date,
      isPublic: image.isPublic,
      url: image.url,
    });
  } catch (error) {
    console.log(error);
    reply.status(500).send("Erreur serveur");
  }
});
export { imageRouter };
