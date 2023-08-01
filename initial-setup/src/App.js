import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Route, Routes as Switch } from "react-router-dom";
import "./App.scss";

import Header from "./header/view";
import LoginScreen from "./login/view";
import PanelAdmin from "./panel-admin/view";
import PlanesRoutes from "./planes/view";
import UsuariosIndex from "./users/view";
import Footer from "../../components/footer/Footer";

import { UserContext } from "./utils/context";
import { authenticate } from "./utils/auth";

/** Componente principal de la aplicación. */
export default function App() {
  const [loggedUser, setLoggedUser] = useState(undefined);

  const checkSession = useCallback(async () => {
    await authenticate()
      .then(resAuth => setLoggedUser(resAuth))
      .catch((err) => {
        console.error('error iniciando sesion', err);
        alert(err.message);
        setLoggedUser(null);
      });
  }, [setLoggedUser])

  useEffect(() => {
    checkSession()
  }, [checkSession]);

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
          <Route path="/" exact element={<PanelAdmin />} />
          <Route path="planes/*" element={<PlanesRoutes />} />
          <Route path="usuarios/" element={<UsuariosIndex />} />
        </Switch>
        <div className="spacer" />
        <Footer />
      </UserContext.Provider>
    </Router>
  );
}
