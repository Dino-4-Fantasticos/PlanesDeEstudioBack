import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import PlanForm from "./_form";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

async function cargarPlan(siglas, setPlan) {
  const resGet = await axios
    .get(`${BACKEND_URL}/planes/${siglas}`)
    .catch((err) => err);
  if (resGet instanceof Error) {
    alert(resGet.response.data.msg);
    return;
  }
  setPlan(resGet.data);
}

async function guardarPlan(plan) {
  const siglas = plan.siglas;
  delete plan.siglas;
  const resPut = await axios
    .put(`${BACKEND_URL}/planes/${siglas}`, plan)
    .catch((err) => err);
  if (resPut instanceof Error) {
    alert(resPut.body.msg);
    return;
  }
  window.location = "/planes";
}

/** Ventana para editar un plan de estudios en específico. */
export default function PlanesEdit() {
  const [plan, setPlan] = useState(undefined);

  const { siglas } = useParams();
  useEffect(() => cargarPlan(siglas, setPlan), [siglas]);

  if (!plan) {
    return <></>;
  }

  return (
    <main id="planes-edit" className="container-fluid">
      <PlanForm plan={plan} action={guardarPlan} />
    </main>
  );
}
