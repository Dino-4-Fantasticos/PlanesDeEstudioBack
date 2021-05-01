import React from "react";
import axios from "axios";

import { backendURL } from "../../utils/variables";
import PlanForm from "./_form";

async function guardarPlan(plan) {
  const resGet = await axios
    .post(`${backendURL}/planes`, plan)
    .catch((err) => err);
  if (resGet instanceof Error) {
    alert(resGet.body.msg);
    return;
  }
  alert(resGet.body.msg);
}

/** Ventana para crear un nuevo plan de estudios. */
export default function PlanesNew() {
  return (
    <main id="planes-new">
      <PlanForm action={guardarPlan} />
    </main>
  );
}
