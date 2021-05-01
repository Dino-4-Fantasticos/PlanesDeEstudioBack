import React from "react";
// import React, { useState } from "react";

/** Componente del formulario para el nuevo plan de estudios. */
export default function PlanesForm({ plan = {}, action }) {
  // const [siglas, setSiglas] = useState(plan.siglas);
  // const [nombre, setNombre] = useState(plan.nombre);
  // const [esVigente, setEsVigente] = useState(plan.esVigente);
  // const [esTec21, setEsTec21] = useState(plan.esTec21);
  // const [materias, setMaterias] = useState(plan.materias);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        action();
      }}
      className="planes-form"
    >
      <p>Wenas</p>
    </form>
  );
}
