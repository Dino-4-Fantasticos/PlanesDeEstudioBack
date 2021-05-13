import React from "react";
import axios from "axios";

import PlanForm from "./form";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

async function guardarPlan(plan) {
  const resPost = await axios
    .post(`${BACKEND_URL}/planes`, plan)
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
    <main id="planes-new" className="container-fluid">
      <PlanForm action={guardarPlan} />
    </main>
  );
}
