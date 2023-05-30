import React, { useEffect, useState } from "react";
import "./style.css";
import { imagePublic } from "../../Services/connexionService";
import { serverAdress } from "../../Services/utils";
import ImageUser from "../../Models/ImageUser";
import { Link } from "react-router-dom";

export default function NewAccount() {
  const [listImage, setListImage] = useState<ImageUser[]>();
  useEffect(() => {
    imagePublic().then((res) => {
      console.log(res);
      setListImage(res);
    });
  }, []);
  return (
    <>
      <div className="header">
        <Link to="/inscription">
          <button>Inscription</button>
        </Link>
        <Link to="/connexion">
          <button>Se connecter</button>
        </Link>
        <br />
      </div>

      <div className="containerMois">
        {listImage
          ? listImage.map((list) => (
              <div className="containerImage">
                <Link to={`/image/${list.url}`}>
                  <img
                    className="imageCarte"
                    src={serverAdress + list.name}
                  ></img>
                </Link>
              </div>
            ))
          : ""}
      </div>
    </>
  );
}
