import React, { useEffect, useState } from "react";
import { HashRouter as Router } from "react-router-dom";
import "./App.scss";

import LoginScreen from "./login/view";
import Header from "./header/view";
import Footer from "./footer/view";

import { UserContext } from "./context";
import { PUBLIC_URL } from "./utils";
import { authenticate } from "./auth";

/** Función que verifica si la sesión está iniciada y cambia el loggedUser correspondientemente. */
async function checkSession(setLoggedUser) {
  const resAuth = await authenticate().catch((err) => err);
  if (resAuth instanceof Error) {
    alert(resAuth.message);
    setLoggedUser(null);
    return;
  }
  setLoggedUser(resAuth);
}

/** Componente principal de la aplicación. */
export default function App() {
  const [loggedUser, setLoggedUser] = useState(undefined);

  useEffect(() => checkSession(setLoggedUser), []);

  if (loggedUser === undefined) {
    return <div>Cargando...</div>;
  }

  if (loggedUser === null) {
    return <LoginScreen />;
  }

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
