import React, { useEffect, useState } from "react";
import "./style.css";
import { serverAdress } from "../../Services/utils";
import { Link, useNavigate } from "react-router-dom";
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
      .then((response) => response.json())
      .then((responseData: ImageUser) => {
        setListImage((prevState) => [...prevState!, responseData]);
        setDroppedImage("");
      })
      .catch((error) => {
        // Gérer les erreurs ici
      });
  }

  function deleteAccount() {
    const url = `${serverAdress}account`;

    fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        // Gérer la réponse de la requête ici
        localStorage.removeItem("tokenSite");
        navigate("/");
      })
      .catch((error) => {
        // Gérer les erreurs ici
      });
  }

  function deleteImage(id: string | undefined) {
    const url = `${serverAdress}deleteImage/${id}`;

    fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(() => {
        setListImage((prevState) =>
          prevState!.filter((image) => image.id !== id)
        );
      })
      .catch((error) => {
        // Gérer les erreurs ici
      });
  }

  function getMonthFromDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString("default", { month: "long" });
  }

  // isAuthorised();
  return (
    <>
      <button onClick={deconnexion}>Se deconnecter</button>{" "}
      <button onClick={deleteAccount}>Supprimer le compte</button>
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
              <Link to={`/image/${list.url}`}>
                <img
                  className="imageCarte"
                  src={serverAdress + list.name}
                ></img>
              </Link>
              <br />
              <button onClick={changeVisibility.bind(null, list.id)}>
                Changer la visibilité
              </button>
              <button onClick={deleteImage.bind(null, list.id)}>
                Supprimer l'image
              </button>
              <p>{list.isPublic ? "public" : "privé"}</p>
            </div>
          ))
        : ""}
      <div className="image-container">
        {listImage
          ? listImage
              .sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);

                // Comparaison par mois
                const monthComparison = dateB.getMonth() - dateA.getMonth();

                // Si les mois sont différents, retourner la comparaison par mois
                if (monthComparison !== 0) {
                  return monthComparison;
                }

                // Comparaison par jour
                return dateB.getDate() - dateA.getDate();
              })
              .map((list, index) => (
                <div key={index} className="image-item">
                  <p>{list.isPublic ? "Public" : "Privé"}</p>
                  <Link to={`/image/${list.url}`}>
                    <img src={serverAdress + list.name} alt="" />
                  </Link>
                  <p>
                    Date:
                    {new Date(list.date).toLocaleString("default", {
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                  <button onClick={() => changeVisibility(list.id)}>
                    Changer la visibilité
                  </button>
                  <button
                    onClick={() => deleteImage(list.id)}
                    style={{ backgroundColor: "purple" }}
                  >
                    Supprimer une image
                  </button>
                </div>
              ))
          : ""}
      </div>
    </>
  );
}
