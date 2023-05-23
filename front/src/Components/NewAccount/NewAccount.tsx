import React, { useState } from "react";
import "./style.css";
import Users from "../../Models/Users";
import { serverAdress } from "../../Services/utils";
import { useNavigate } from "react-router-dom";
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
      <input
        type="email"
        id="pseudo"
        value={pseudo}
        onChange={handlePseudoChange}
      />
      <br />
      <input
        type="password"
        id="password"
        value={password}
        onChange={handlePasswordChange}
      />{" "}
      <br />
      <button onClick={submit}>S'inscrire</button>
    </>
  );
}
