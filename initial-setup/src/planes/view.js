import React from "react";
import { Route, Routes as Switch } from "react-router-dom";
import "./_view/style.scss";

import PlanesIndex from "./_view/index";
import PlanesNew from "./_view/new";
import PlanesEdit from "./_view/edit";

/** Componente principal de la aplicación. */
export default function PlanesRoutes() {

  return (
    <Switch>
      <Route path="" element={<PlanesIndex />} />
      <Route path={`new/`} exact element={<PlanesNew />} />
      <Route path={`:siglas/edit`} element={<PlanesEdit />} />
    </Switch>
  );
}
