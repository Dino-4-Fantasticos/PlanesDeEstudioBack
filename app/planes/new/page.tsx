"use client"

import React from "react";

import PlanForm from "../plan_form";
import "../../../styles/planes.scss";
import usePlan from "../../../hooks/usePlan";

export default function PlanesNew() {
  const { guardarPlan } = usePlan();

  return (
    <main id="planes-new" className="container-fluid">
      <PlanForm action={guardarPlan} />
    </main>
  );
}
