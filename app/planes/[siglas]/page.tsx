"use client"

import React, { useEffect, useMemo } from "react";
// import { useParams } from "react-router-dom";
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

import PlanForm from "../plan_form";
import "../../../styles/planes.scss";
import usePlan from '../../../hooks/usePlan';

/** Ventana para editar un plan de estudios en específico. */
export default function PlanesEdit() {
  const pathname = usePathname();

  const { cargarPlan, actualizarPlan, plan } = usePlan();


  const siglas = useMemo(() => {
    const paths = pathname?.split('/');
    return paths.length ? paths[paths.length - 1] : "";
  }, [pathname])

  useEffect(() => {
    if (siglas) {
      cargarPlan(siglas);
    }
  }, [cargarPlan, siglas]);

  if (!plan) {
    return <>El plan no cargó</>;
  }

  console.log(plan)

  return (
    <main id="planes-edit" className="container-fluid">
      <PlanForm plan={plan} action={actualizarPlan} />
    </main>
  );
}
