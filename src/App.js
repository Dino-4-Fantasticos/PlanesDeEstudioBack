import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.scss";

import Header from "./header/view";
import LoginScreen from "./login/view";
import PanelAdmin from "./panel-admin/view";
import PlanesRoutes from "./planes/views/routes";
import Footer from "./footer/view";

import { UserContext } from "./utils/context";
import { authenticate } from "./utils/auth";

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
    <Router>
      <UserContext.Provider value={loggedUser}>
        <Header />
        <div className="spacer" />
        <Switch>
          <Route path="/" exact component={PanelAdmin} />
          <Route path="/planes" component={PlanesRoutes} />
        </Switch>
        <div className="spacer" />
        <Footer />
      </UserContext.Provider>
    </Router>
  );
}
