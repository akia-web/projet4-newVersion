import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import "./App.css";
import Home from "./Components/Home/Home";
import NewAccount from "./Components/NewAccount/NewAccount";
import Login from "./Components/Login/Login";
import Profil from "./Components/profile/profile";

function App() {
  // console.log(listImage);
  return (
    <>
      <Routes>
        {/* <Route path="/test" element={<Exo profession="physicist"></Exo>} /> */}
        {/* <Route path="/chemin/:id" element={<IfComponent />} /> */}
        <Route path="/" element={<Home></Home>} />
        <Route path="/inscription" element={<NewAccount></NewAccount>} />
        <Route path="/connexion" element={<Login></Login>} />
        <Route path="/profil" element={<Profil></Profil>} />
      </Routes>
    </>
  );
}

export default App;
