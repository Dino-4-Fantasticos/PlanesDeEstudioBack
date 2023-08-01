"use client"

import React, { useEffect, useState, useMemo } from "react";
// import { useParams } from "react-router-dom";
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import axios from "axios";

import PlanForm from "../plan_form";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

async function cargarPlan(siglas, setPlan) {
  const resGet = await axios
    .get(`${BACKEND_URL}/planes/${siglas}`)
    .catch((err) => err);
  if (resGet instanceof Error) {
    alert(resGet?.response?.data?.msg);
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
    alert(resPut?.body?.msg);
    return;
  }
  window.location = "/planes";
}

/** Ventana para editar un plan de estudios en específico. */
export default function PlanesEdit() {
  const [plan, setPlan] = useState(undefined);

  const pathname = usePathname()

  const siglas = useMemo(() => {
    const paths = pathname?.split('/');
    return paths.length ? paths[paths.length - 1] : "";
  }, [pathname])

  useEffect(() => {
    if (siglas) {
      cargarPlan(siglas, setPlan);
    }
  }, [siglas]);

  if (!plan) {
    return <>El plan no cargó</>;
  }

  return (
    <main id="planes-edit" className="container-fluid">
      <PlanForm plan={plan} action={guardarPlan} />
    </main>
  );
}
