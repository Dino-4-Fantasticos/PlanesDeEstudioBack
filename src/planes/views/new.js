import React from "react";
import axios from "axios";

import { backendURL } from "../../utils/variables";
import PlanForm from "./_form";

async function guardarPlan(plan) {
  const resPost = await axios
    .post(`${backendURL}/planes`, plan)
    .catch((err) => err);
  if (resPost instanceof Error) {
    throw resPost;
  }
  alert(resPost.data.msg);
  window.location = "/planes";
  return resPost;
}

/** Ventana para crear un nuevo plan de estudios. */
export default function PlanesNew() {
  return (
    <main id="planes-new">
      <PlanForm action={guardarPlan} />
    </main>
  );
}
