import React, { useEffect, useState } from "react";
import axios from "axios";

import PlanSummary from "./plan-summary";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

async function fetchPlanes(setPlanes) {
  const resGet = await axios.get(`${BACKEND_URL}/planes`).catch((err) => err);
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
    <main id="planes-index" className="container">
      <h1 className="w-100 text-center">Planes de estudio</h1>
      {planes.map((plan, idx) => (
        <PlanSummary key={`plan-${idx}`} {...{ plan }} />
      ))}
      <div className="text-right">
        <a href={`${pathName}/new`}>
          <button className="btn btn-lg btn-warning">Nuevo Plan</button>
        </a>
      </div>
    </main>
  );
}
