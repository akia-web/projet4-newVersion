import React, { useState } from "react";
import "./style.css";
import Users from "../../Models/Users";
import { serverAdress } from "../../Services/utils";
import { Link, useNavigate } from "react-router-dom";
export default function NewAccount() {
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function submit() {
    const data: Users = {
      email: pseudo,
      password,
    };

    const url = `${serverAdress}account`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => {
      navigate("/");
    });
  }

  function handlePseudoChange(event: any) {
    setPseudo(event.target.value);
  }
  function handlePasswordChange(event: any) {
    setPassword(event.target.value);
  }

  return (
    <>
      <Link to={"/"}>
        <span className="material-symbols-outlined">home</span>
      </Link>

      <div className="container">
        <div className="form">
          <h1>Inscription</h1>
          <input
            type="email"
            id="pseudo"
            placeholder="email"
            value={pseudo}
            onChange={handlePseudoChange}
          />
          <br />
          <input
            type="password"
            id="password"
            placeholder="mot de passe"
            value={password}
            onChange={handlePasswordChange}
          />{" "}
          <br />
          <button className="top" onClick={submit}>
            S'inscrire
          </button>
        </div>
      </div>
    </>
  );
}
