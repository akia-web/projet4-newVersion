import React, { useEffect, useState } from "react";
import "./style.css";
import { serverAdress } from "../../Services/utils";
import { Link, useNavigate } from "react-router-dom";
import {
  changeVisibilityImage,
  imageByUser,
} from "../../Services/connexionService";
import ImageUser from "../../Models/ImageUser";
import ListeImage from "../../Models/ListeImage";

export default function Profil() {
  const token = localStorage.getItem("tokenSite");
  const navigate = useNavigate();
  const [listImage, setListImage] = useState<ListeImage[]>();
  const [droppedImage, setDroppedImage] = useState("");
  const [imageFile, setImage] = useState<Blob | string>();

  useEffect(() => {
    isAuthorised().then((res) => {
      if (res == "connexion refusée") {
        navigate("/");
      }
    });

    imageByUser().then((res) => {
      // console.log(res);
      if (res.response !== "Authentification invalide") {
        setListImage(res);
        console.log(listImage);
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

  function changeVisibility(
    id: string | undefined,
    indexMonth: number,
    indexImage: number
  ) {
    changeVisibilityImage(id).then((res) => {
      setListImage((prevState) => {
        return prevState!.map((list, listIndex) => {
          if (listIndex === indexMonth) {
            const updatedImages = list.images.map((image, imageIndex) => {
              if (imageIndex === indexImage) {
                return {
                  ...image,
                  isPublic: !image.isPublic,
                };
              }
              return image;
            });
            return {
              ...list,
              images: updatedImages,
            };
          }
          return list;
        });
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
        setListImage((prevState) => {
          const date = new Date(responseData.date);
          const currentMonth = date.toLocaleString("fr-FR", { month: "long" });
          console.log(currentMonth);
          const monthIndex = prevState!.findIndex(
            (list) => list.mois === currentMonth
          );

          console.log(monthIndex);
          if (monthIndex !== -1) {
            return prevState!.map((list, index) => {
              if (index === monthIndex) {
                return {
                  ...list,
                  images: [responseData, ...list.images],
                };
              }
              return list;
            });
          } else {
            return [
              ...prevState!,
              {
                mois: currentMonth,
                images: [responseData],
              },
            ];
          }
        });
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

  function deleteImage(
    id: string | undefined,
    indexMonth: number,
    indexImage: number
  ) {
    const url = `${serverAdress}deleteImage/${id}`;

    fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(() => {
        setListImage((prevState) =>
          prevState!.map((list, monthIndex) => {
            if (monthIndex === indexMonth) {
              return {
                ...list,
                images: list.images.filter(
                  (image, imageIndex) => imageIndex !== indexImage
                ),
              };
            }
            return list;
          })
        );
      })
      .catch((error) => {
        // Gérer les erreurs ici
      });
  }

  function getDate(dateString: Date) {
    const date = new Date(dateString);
    const jour = date.getDate();
    const mois = date.getMonth() + 1;
    const annee = date.getFullYear();
    return jour + "/" + mois + "/" + annee;
  }

  // isAuthorised();
  return (
    <>
      <div className="header">
        <Link to={"/"}>
          {" "}
          <span className="material-symbols-outlined">home</span>
        </Link>
        <button onClick={deconnexion}>Se deconnecter</button>{" "}
        <button className="delete" onClick={deleteAccount}>
          Supprimer le compte
        </button>
      </div>

      <div className="containerDrag">
        <div className="drag" onDragOver={handleDragOver} onDrop={handleDrop}>
          {droppedImage ? (
            <img
              src={droppedImage}
              alt="Dropped Image"
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <p>Déposez une image ici</p>
          )}
        </div>
        <button onClick={sendImage}>Envoyer l'image</button>
      </div>

      {listImage
        ? listImage.map((list, listIndex) => (
            <div className="containerAllImages">
              <h2>{list.mois}</h2>
              <div className="containerMois">
                {list.images.map((image, imageIndex) => (
                  <div className="containerImage">
                    <Link to={`/image/${image.url}`}>
                      <img src={serverAdress + image.name} alt="" />
                    </Link>{" "}
                    <br />
                    <p>{getDate(image.date)}</p>
                    <span
                      className="material-symbols-outlined cursor"
                      onClick={changeVisibility.bind(
                        null,
                        image.id,
                        listIndex,
                        imageIndex
                      )}
                    >
                      {image.isPublic ? "visibility" : "visibility_off"}
                    </span>
                    <p>{image.isPublic ? "public" : "privé"}</p>
                    <span
                      className="material-symbols-outlined cursor red"
                      onClick={deleteImage.bind(
                        null,
                        image.id,
                        listIndex,
                        imageIndex
                      )}
                    >
                      delete_forever
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        : ""}

      {/* <div className="image-container">
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
      </div> */}
    </>
  );
}
