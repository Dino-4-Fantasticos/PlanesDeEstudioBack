import React, { useState, useContext } from "react";
import axios from "axios";
import PlanFormContext from "./context";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

/** Función para editar la matriz de materias. */
function agregarMateria(materia, setMaterias, semIdx) {
  setMaterias((m) => {
    const semestre = m[semIdx];
    const editedSemestre = [...semestre, materia];
    const newMaterias = [
      ...m.slice(0, semIdx),
      editedSemestre,
      ...m.slice(semIdx + 1),
    ];
    return newMaterias;
  });
}

/** Función para editar la matriz de materias. */
/*
function editarMateria(materia, setMaterias, semIdx, matIdx) {
  setMaterias((m) => {
    const semestre = m[semIdx];
    const editedSemestre = [
      ...semestre.slice(0, matIdx),
      materia,
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
*/

/** Componente formulario para agregar una nueva materia. */
export default function NewMateria({ toggleShowNewMateria, semIdx }) {
  const { materias, setMaterias, esTec21 } = useContext(PlanFormContext);

  const periodosDefault = esTec21 ? [false, false, false] : null;

  const [clave, setClave] = useState("");
  const [errClave, setErrClave] = useState("");
  const [nombre, setNombre] = useState("");
  const [errNombre, setErrNombre] = useState("");
  const [periodos, setPeriodos] = useState(periodosDefault);
  const [errPeriodos, setErrPeriodos] = useState("");
  const [horasClase, setHorasClase] = useState("");
  const [errHorasClase, setErrHorasClase] = useState("");
  const [horasLaboratorio, setHorasLaboratorio] = useState("");
  const [errHorasLaboratorio, setErrHorasLaboratorio] = useState("");
  const [unidades, setUnidades] = useState("");
  const [errUnidades, setErrUnidades] = useState("");
  const [creditosAcademicos, setCreditosAcademicos] = useState("");
  const [errCreditosAcademicos, setErrCreditosAcademicos] = useState("");
  const [unidadesDeCarga, setUnidadesDeCarga] = useState("");
  const [errUnidadesDeCarga, setErrUnidadesDeCarga] = useState("");

  async function guardarMateria() {
    const nuevaMateria = {
      clave,
      nombre,
      periodos,
      horasClase,
      horasLaboratorio,
      unidades,
      creditosAcademicos,
      unidadesDeCarga,
    };
    const postData = {
      esTec21,
      materias,
      semIdx,
      nuevaMateria,
    };
    const resValidate = await axios
      .post(`${BACKEND_URL}/planes/validate-materia`, postData)
      .catch((err) => err);
    if (resValidate instanceof Error) {
      const errors = resValidate.response.data.err;
      const { materias } = errors;
      if (materias) {
        setErrClave(materias[nuevaMateria.clave].clave);
      } else {
        setErrClave(errors.clave);
        setErrNombre(errors.nombre);
        setErrPeriodos(errors.periodos);
        setErrHorasClase(errors.horasClase);
        setErrHorasLaboratorio(errors.horasLaboratorio);
        setErrUnidades(errors.unidades);
        setErrCreditosAcademicos(errors.creditosAcademicos);
        setErrUnidadesDeCarga(errors.unidadesDeCarga);
      }
      return;
    }
    toggleShowNewMateria(false);
    agregarMateria(nuevaMateria, setMaterias, semIdx);
  }

  return (
    <div className="card new-materia p-2">
      <div className="form-group">
        <label className="text-dark">Clave:</label>
        <input
          type="text"
          autoComplete="nope"
          className="form-control clave-form"
          placeholder="Ej. [TC1018]"
          value={clave}
          onChange={(e) => {
            setClave(e.target.value.toUpperCase());
            setErrClave("");
          }}
        />
        <p className="text-danger">{errClave}</p>
      </div>

      <div className="form-group">
        <label className="text-dark">Nombre:</label>
        <input
          type="text"
          autoComplete="nope"
          className="form-control"
          placeholder="Ej. [Estructura de Datos]"
          value={nombre}
          onChange={(e) => {
            setNombre(e.target.value);
            setErrNombre("");
          }}
        />
        <p className="text-danger">{errNombre}</p>
      </div>

      <div className="form-group inline-form-group mb-1">
        <div className="d-flex">
          <label className="text-dark">Horas de clase:</label>
          <input
            type="number"
            autoComplete="nope"
            className="form-control pl-2 pr-1"
            value={horasClase}
            onChange={(e) => {
              setHorasClase(e.target.value);
              setErrHorasClase("");
            }}
          />
        </div>
        <p className="text-danger">{errHorasClase}</p>
      </div>

      <div className="form-group inline-form-group mb-1">
        <div className="d-flex">
          <label className="text-dark">Horas de laboratorio:</label>
          <input
            type="number"
            autoComplete="nope"
            className="form-control pl-2 pr-1"
            value={horasLaboratorio}
            onChange={(e) => {
              setHorasLaboratorio(e.target.value);
              setErrHorasLaboratorio("");
            }}
          />
        </div>
        <p className="text-danger">{errHorasLaboratorio}</p>
      </div>

      <div className="form-group inline-form-group mb-1">
        <div className="d-flex">
          <label className="text-dark">Unidades:</label>
          <input
            type="number"
            autoComplete="nope"
            className="form-control pl-2 pr-1"
            value={unidades}
            onChange={(e) => {
              setUnidades(e.target.value);
              setErrUnidades("");
            }}
          />
        </div>
        <p className="text-danger">{errUnidades}</p>
      </div>

      <div className="form-group inline-form-group mb-1">
        <div className="d-flex">
          <label className="text-dark">Créditos académicos:</label>
          <input
            type="number"
            autoComplete="nope"
            className="form-control pl-2 pr-1"
            value={creditosAcademicos}
            onChange={(e) => {
              setCreditosAcademicos(e.target.value);
              setErrCreditosAcademicos("");
            }}
          />
        </div>
        <p className="text-danger">{errCreditosAcademicos}</p>
      </div>

      <div className="form-group inline-form-group mb-1">
        <div className="d-flex">
          <label className="text-dark">Unidades de carga:</label>
          <input
            type="number"
            autoComplete="nope"
            className="form-control pl-2 pr-1"
            value={unidadesDeCarga}
            onChange={(e) => {
              setUnidadesDeCarga(e.target.value);
              setErrUnidadesDeCarga("");
            }}
          />
        </div>
        <p className="text-danger">{errUnidadesDeCarga}</p>
      </div>

      {esTec21 && (
        <div className="form-group">
          <label className="text-dark">Periodos:</label>
          <div className="periodos-container">
            <button
              type="button"
              className={`flex-grow-1 ${periodos[0] && "bg-primary"}`}
              onClick={() => setPeriodos((p) => [!p[0], p[1], p[2]])}
            ></button>
            <button
              type="button"
              className={`flex-grow-1 ${periodos[1] && "bg-primary"}`}
              onClick={() => setPeriodos((p) => [p[0], !p[1], p[2]])}
            ></button>
            <button
              type="button"
              className={`flex-grow-1 ${periodos[2] && "bg-primary"}`}
              onClick={() => setPeriodos((p) => [p[0], p[1], !p[2]])}
            ></button>
          </div>
          <small className="text-danger">{errPeriodos}</small>
        </div>
      )}

      <button
        type="button"
        onClick={guardarMateria}
        className="btn btn-primary btn-guardar-materia mb-1"
      >
        Guardar nueva materia
      </button>
      <button
        type="button"
        onClick={() => toggleShowNewMateria(false)}
        className="btn btn-sm btn-outline-secondary"
      >
        Cancelar
      </button>
    </div>
  );
}
