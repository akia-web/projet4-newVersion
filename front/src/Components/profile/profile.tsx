import React, { useEffect, useState } from "react";
import "./style.css";
import { serverAdress } from "../../Services/utils";
import { useNavigate } from "react-router-dom";
import {
  changeVisibilityImage,
  imageByUser,
} from "../../Services/connexionService";
import ImageUser from "../../Models/ImageUser";

export default function Profil() {
  const token = localStorage.getItem("tokenSite");
  const navigate = useNavigate();
  const [listImage, setListImage] = useState<ImageUser[]>();
  const [droppedImage, setDroppedImage] = useState("");
  const [imageFile, setImage] = useState<Blob | string>();

  useEffect(() => {
    isAuthorised().then((res) => {
      if (res == "connexion refusée") {
        navigate("/");
      }
    });

    imageByUser().then((res) => {
      console.log(res);
      if (res.response !== "Authentification invalide") {
        setListImage(res);
      }
    });
  }, []);

  async function isAuthorised() {
    const url = `${serverAdress}verify-token`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const responseData = await response.json();
    return responseData.response;
  }

  function deconnexion() {
    localStorage.removeItem("tokenSite");
    navigate("/");
  }

  function changeVisibility(id: string | undefined) {
    changeVisibilityImage(id).then((res) => {
      setListImage((prevState) => {
        const updatedList = prevState!.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              isPublic: !item.isPublic,
            };
          }
          return item;
        });

        return updatedList;
      });
    });
  }

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    const imageFile = e.dataTransfer.files[0];
    console.log(imageFile.name);
    const imageUrl = URL.createObjectURL(imageFile);
    setDroppedImage(imageUrl);
    setImage(imageFile);
  };

  function sendImage() {
    const url = `${serverAdress}images`; // URL de l'endpoint de réception du fichier
    const formData = new FormData();
    if (imageFile) {
      formData.append("image", imageFile);
    }

    fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        // Gérer la réponse de la requête ici
      })
      .catch((error) => {
        // Gérer les erreurs ici
      });
  }
  // isAuthorised();
  return (
    <>
      <button onClick={deconnexion}>Se deconnecter</button>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{ width: "300px", height: "300px", border: "1px solid black" }}
      >
        {droppedImage ? (
          <img
            src={droppedImage}
            alt="Dropped Image"
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <p>Drag and drop an image here</p>
        )}
      </div>
      <button onClick={sendImage}>Envoyer l'image</button>

      {listImage
        ? listImage.map((list) => (
            <div>
              <img className="imageCarte" src={serverAdress + list.name}></img>
              <br />
              <button onClick={changeVisibility.bind(null, list.id)}>
                Changer la visibilité
              </button>
              <p>{list.isPublic ? "public" : "privé"}</p>
            </div>
          ))
        : ""}
    </>
  );
}
