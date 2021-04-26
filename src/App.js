import React, { useEffect, useState } from "react";
import { HashRouter as Router } from "react-router-dom";
import "./App.scss";

import Header from "./header/view";
import Footer from "./footer/view";

import { UserContext } from "./context";
import { PUBLIC_URL } from "./utils";
import { authenticate } from "./auth";

/** Función que verifica si la sesión está iniciada y cambia el loggedUser correspondientemente. */
async function checkSession(setLoggedUser) {
  const resAuth = await authenticate().catch((err) => err);
  if (resAuth instanceof Error) {
    if (!resAuth.response) {
      alert(
        "Hubo un error de conexión al servidor para validar sesión iniciada."
      );
    } else if (resAuth.response.data.msg) {
      alert(resAuth.response.data.msg);
    }
    setLoggedUser(null);
    return;
  }
  setLoggedUser(resAuth);
}

/** Componente principal de la aplicación. */
export default function App() {
  const [loggedUser, setLoggedUser] = useState(undefined);

  useEffect(() => checkSession(setLoggedUser), []);

  return (
    <Router basename={PUBLIC_URL}>
      <UserContext.Provider value={loggedUser}>
        <Header />
        <div className="flex-grow-1"></div>
        <Footer />
      </UserContext.Provider>
    </Router>
  );
}
