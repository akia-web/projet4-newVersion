import React, { useState } from "react";
import "./style.css";
import Users from "../../Models/Users";
import { serverAdress } from "../../Services/utils";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function submit() {
    const data: Users = {
      email: pseudo,
      password,
    };

    const url = `${serverAdress}login`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      const token = responseData.token;
      console.log(token);

      localStorage.setItem("tokenSite", token);

      // Effectuer d'autres actions en fonction de la réponse
      navigate("/profil");
    } catch (error) {
      console.log(error);
    }
  }

  function handlePseudoChange(event: any) {
    setPseudo(event.target.value);
  }
  function handlePasswordChange(event: any) {
    setPassword(event.target.value);
  }

  return (
    <>
      <div className="container">
        <div className="form">
          <h1 className="titre">Connexion à votre compte</h1>
          <input
            type="email"
            placeholder="email"
            id="pseudo"
            value={pseudo}
            onChange={handlePseudoChange}
          />
          <br />
          <input
            type="password"
            placeholder="mot de passe"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />{" "}
          <br />
          <button className="top" onClick={submit}>
            Se connecter
          </button>
        </div>
      </div>
    </>
  );
}
