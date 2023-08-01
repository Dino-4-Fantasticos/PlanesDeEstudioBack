import React, { useState } from "react";
import Materia from "../materia/materia";
import FormMateria from "../materia/form_materia/form_materia";

/** Componente referente al contenido de un semestre escolar. */
export default function Semestre({ semestre, semIdx, setMaterias }) {
  const [showNewMateria, toggleShowNewMateria] = useState(false);

  return (
    <div key={`sem-${semIdx + 1}`} className="d-flex p-1 flex-column semestre">
      <label className="mt-1 mb-1">Semestre {semIdx}</label>
      {semestre.map((materia, matIdx) => (
        <Materia
          key={`sem-${semIdx}-mat-${matIdx}`}
          {...{ materia, semIdx, matIdx }}
        />
      ))}
      <div className="spacer" />
      {showNewMateria && (
        <FormMateria toggleShow={toggleShowNewMateria} semIdx={semIdx} />
      )}
      {!showNewMateria && (
        <button
          type="button"
          onClick={() => toggleShowNewMateria(true)}
          className="btn btn-light mt-3"
        >
          +
        </button>
      )}
      <button
        type="button"
        onClick={() => {
          const confirmMessage = `¿Remover semestre y todas sus materias?`;
          if (!window.confirm(confirmMessage)) return;
          setMaterias((m) => [...m.slice(0, semIdx), ...m.slice(semIdx + 1)]);
        }}
        className="remover-semestre btn btn-danger mt-1"
      >
        Remover semestre
      </button>
    </div>
  );
}
