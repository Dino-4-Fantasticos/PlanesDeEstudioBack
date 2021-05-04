import React from "react";
import { Route, Switch } from "react-router-dom";

import PlanesIndex from "./index";
import PlanesNew from "./new";
import PlanesEdit from "./edit";

import "./style.scss";

/** Componente principal de la aplicación. */
export default function PlanesRoutes() {
  const currRoute = "/planes";
  return (
    <Switch>
      <Route path={currRoute} exact component={PlanesIndex} />
      <Route path={`${currRoute}/new`} exact component={PlanesNew} />
      <Route path={`${currRoute}/:siglas/edit`} component={PlanesEdit} />
    </Switch>
  );
}
