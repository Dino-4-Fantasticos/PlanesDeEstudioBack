import React from "react";
import { Route, Switch } from "react-router-dom";
import "./_view/style.scss";

import PlanesIndex from "./_view/index";
import PlanesNew from "./_view/new";
import PlanesEdit from "./_view/edit";

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
