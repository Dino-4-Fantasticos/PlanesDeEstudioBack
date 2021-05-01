import React, { useEffect, useState } from "react";
import axios from "axios";

import { backendURL } from "../../utils/variables";
import PlanSummary from "./summary";

async function fetchPlanes(setPlanes) {
  const resGet = await axios.get(`${backendURL}/planes`).catch((err) => err);
  if (resGet instanceof Error) {
    alert(resGet.message);
    setPlanes(null);
    return;
  }
  setPlanes(resGet.data);
}

/** Lista de todos los planes registrados. */
export default function PlanesIndex() {
  const [planes, setPlanes] = useState([]);

  useEffect(() => fetchPlanes(setPlanes), []);

  const pathName = window.location.pathname;

  return (
    <main id="planes-index">
      <h1 className="w-100 text-center">Planes de estudio</h1>
      {planes.map((plan) => (
        <PlanSummary {...plan} />
      ))}
      <div className="text-right">
        <a href={`${pathName}/new`}>
          <button className="btn btn-lg btn-warning">Nuevo Plan</button>
        </a>
      </div>
    </main>
  );
}
