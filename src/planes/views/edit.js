import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { backendURL } from "../../utils/variables";
import PlanForm from "./_form";

async function cargarPlan(siglas, setPlan) {
  const resGet = await axios
    .get(`${backendURL}/planes/${siglas}`)
    .catch((err) => err);
  if (resGet instanceof Error) {
    alert(resGet.response.data.msg);
    // window.location = "/planes";
    return;
  }
  setPlan(resGet);
}

async function guardarPlan(plan) {
  const resGet = await axios
    .put(`${backendURL}/planes/${plan.siglas}`, plan)
    .catch((err) => err);
  if (resGet instanceof Error) {
    alert(resGet.body.msg);
    return;
  }
  alert(resGet.body.msg);
}

/** Ventana para editar un plan de estudios en específico. */
export default function PlanesEdit() {
  const [plan, setPlan] = useState(undefined);

  const { siglas } = useParams();
  useEffect(() => cargarPlan(siglas, setPlan), [siglas]);

  return (
    <main id="planes-edit">
      <PlanForm plan={plan} action={guardarPlan} />
    </main>
  );
}
