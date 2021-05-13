import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import PlanFormContext from "./context";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const DEFAULT_HORAS_CLASE = 3;
const DEFAULT_HORAS_LABORATORIO = 0;
const DEFAULT_UNIDADES = 8;
const DEFAULT_CREDITOS_ACADEMICOS = 3;
const DEFAULT_UNIDADES_DE_CARGA = 3.5;

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

/** Componente formulario para agregar una nueva materia. */
export default function FormMateria({
  toggleShow,
  semIdx,
  materia = {},
  matIdx,
}) {
  const { materias, setMaterias, esTec21 } = useContext(PlanFormContext);

  const editMode = Object.keys(materia).length > 0;

  const periodosDefault = esTec21 ? [false, false, false] : null;

  const [clave, setClave] = useState(materia.clave || "");
  const [errClave, setErrClave] = useState("");
  const [nombre, setNombre] = useState(materia.nombre || "");
  const [errNombre, setErrNombre] = useState("");
  const [periodos, setPeriodos] = useState(materia.periodos || periodosDefault);
  const [errPeriodos, setErrPeriodos] = useState("");
  const [horasClase, setHorasClase] = useState(
    materia.horasClase ?? DEFAULT_HORAS_CLASE
  );
  const [errHorasClase, setErrHorasClase] = useState("");
  const [horasLaboratorio, setHorasLaboratorio] = useState(
    materia.horasLaboratorio ?? DEFAULT_HORAS_LABORATORIO
  );
  const [errHorasLaboratorio, setErrHorasLaboratorio] = useState("");
  const [unidades, setUnidades] = useState(
    materia.unidades ?? DEFAULT_UNIDADES
  );
  const [errUnidades, setErrUnidades] = useState("");
  const [creditosAcademicos, setCreditosAcademicos] = useState(
    materia.creditosAcademicos ?? DEFAULT_CREDITOS_ACADEMICOS
  );
  const [errCreditosAcademicos, setErrCreditosAcademicos] = useState("");
  const [unidadesDeCarga, setUnidadesDeCarga] = useState(
    materia.unidadesDeCarga ?? DEFAULT_UNIDADES_DE_CARGA
  );
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
      editMode: Object.keys(materia).length > 0,
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
    toggleShow(false);
    if (Object.keys(materia).length) {
      editarMateria(nuevaMateria, setMaterias, semIdx, matIdx);
    } else {
      agregarMateria(nuevaMateria, setMaterias, semIdx);
    }
  }

  useEffect(() => {
    async function fetchInfoMateria() {
      if (!/^[A-Z]{1,2}[0-9]{4}[A-Z]?$/.test(clave)) return;
      const resGet = await axios
        .get(`${BACKEND_URL}/materias/${clave}`)
        .catch((err) => err);
      if (resGet instanceof Error) return;
      const { data } = resGet;
      setNombre(data.nombre);
      setHorasClase(data.horasClase);
      setHorasLaboratorio(data.horasLaboratorio);
      setUnidades(data.unidades);
      setCreditosAcademicos(data.creditosAcademicos);
      setUnidadesDeCarga(data.unidadesDeCarga);
      if (esTec21 && data.periodos) setPeriodos(data.periodos);
    }
    fetchInfoMateria();
  }, [clave, esTec21]);

  return (
    <section className="card new-materia p-2 mt-1">
      <div className="form-group mb-1">
        {editMode && (
          <input
            type="text"
            autoComplete="nope"
            className="form-control clave-form"
            style={{ backgroundColor: "#00000030" }}
            disabled
            value={clave}
            onChange={(e) => {
              setClave(e.target.value.toUpperCase());
              setErrClave("");
            }}
          />
        )}
        {!editMode && (
          <input
            type="text"
            autoComplete="nope"
            className="form-control clave-form"
            placeholder="Ej. [TC1018]"
            maxLength="7"
            value={clave}
            onChange={(e) => {
              setClave(e.target.value.toUpperCase());
              setErrClave("");
            }}
          />
        )}
        <label className="form-label">Clave:</label>
        <p className="text-danger">{errClave}</p>
      </div>

      <div className="form-group">
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
        <label className="form-label">Nombre:</label>
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
        onClick={() => toggleShow(false)}
        className="btn btn-sm btn-outline-secondary"
      >
        Cancelar
      </button>
    </section>
  );
}
