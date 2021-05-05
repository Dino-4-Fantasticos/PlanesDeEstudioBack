import React, { useState, useContext } from "react";
import editIcon from "../../../assets/edit_white_24dp.svg";
import deleteIcon from "../../../assets/delete_white_24dp.svg";
import PlanFormContext from "./context";
import FormMateria from "./form-materia";

/** Función para remover una materia de la matriz de materias. */
function removerMateria(setMaterias, semIdx, matIdx) {
  setMaterias((m) => {
    const semestre = m[semIdx];
    const editedSemestre = [
      ...semestre.slice(0, matIdx),
      ...semestre.slice(matIdx + 1),
    ];
    const newMaterias = [
      ...m.slice(0, semIdx),
      editedSemestre,
      ...m.slice(semIdx + 1),
    ];
    return newMaterias;
  });
}

/** Componente para una materia dentro del formulario de plan de estudios. */
export default function Materia({ materia, semIdx, matIdx }) {
  const {
    clave,
    nombre,
    periodos,
    horasClase,
    horasLaboratorio,
    unidades,
    creditosAcademicos,
    unidadesDeCarga,
  } = materia;

  const [editMode, toggleEditMode] = useState(false);
  const [isHovered, toggleHover] = useState(false);

  const { setMaterias } = useContext(PlanFormContext);

  if (editMode) {
    return (
      <FormMateria
        {...{ semIdx, materia, matIdx }}
        toggleShow={toggleEditMode}
      />
    );
  }

  return (
    <>
      <figure
        className="materia card mt-1"
        onMouseEnter={() => toggleHover(true)}
        onMouseLeave={() => toggleHover(false)}
      >
        <div>
          <div className="p-1">
            <p className="nombre-materia">{nombre}</p>
            <small className="clave-materia font-weight-bold mt-2">
              {clave}
            </small>
            <small className="carga-academica mt-1">
              {horasClase} - {horasLaboratorio} - {unidades} -{" "}
              {creditosAcademicos} - {unidadesDeCarga}
            </small>
          </div>
          {periodos && (
            <div className="periodos-container">
              <div className={`flex-grow-1 ${periodos[0] && "bg-primary"}`} />
              <div className={`flex-grow-1 ${periodos[1] && "bg-primary"}`} />
              <div className={`flex-grow-1 ${periodos[2] && "bg-primary"}`} />
            </div>
          )}
        </div>
        {isHovered && (
          <div className="hover-materia-banner">
            <img
              src={editIcon}
              alt="delete"
              width={30}
              className="cursor-pointer"
              onClick={() => toggleEditMode(true)}
            />
            <img
              src={deleteIcon}
              alt="delete"
              width={30}
              className="cursor-pointer"
              onClick={() => removerMateria(setMaterias, semIdx, matIdx)}
            />
          </div>
        )}
      </figure>
    </>
  );
}
