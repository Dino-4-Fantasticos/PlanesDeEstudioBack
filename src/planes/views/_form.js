import React, { useState, useContext } from "react";
import deleteIcon from "../../assets/delete_white_24dp.svg";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const NewMateriaContext = React.createContext();

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

/** Componente formulario para agregar una nueva materia. */
function NewMateria({ toggleShowNewMateria, semIdx }) {
  const { materias, setMaterias, esTec21 } = useContext(NewMateriaContext);

  const periodosDefault = esTec21 ? [false, false, false] : null;

  const [clave, setClave] = useState("");
  const [errClave, setErrClave] = useState("");
  const [nombre, setNombre] = useState("");
  const [errNombre, setErrNombre] = useState("");
  const [periodos, setPeriodos] = useState(periodosDefault);
  const [errPeriodos, setErrPeriodos] = useState(true);

  async function guardarMateria() {
    const nuevaMateria = { clave, nombre, periodos };
    const postData = { esTec21, materias, semIdx, nuevaMateria };
    const resValidate = await axios
      .post(`${BACKEND_URL}/planes/validate-materia`, postData)
      .catch((err) => err);
    if (resValidate instanceof Error) {
      const errors = resValidate.response.data.err;
      const { materias, clave, nombre, periodos } = errors;
      if (materias) {
        setErrClave(materias[nuevaMateria.clave].clave);
      } else {
        setErrClave(clave);
        setErrNombre(nombre);
        setErrPeriodos(periodos);
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

/** Componente para una materia dentro del formulario de plan de estudios. */
function Materia({ materia, semIdx, matIdx }) {
  const { clave, nombre, periodos } = materia;
  const [isHovered, toggleHover] = useState(false);

  const { setMaterias } = useContext(NewMateriaContext);

  return (
    <>
      <figure
        className="materia card mb-1"
        onMouseEnter={() => toggleHover(true)}
        onMouseLeave={() => toggleHover(false)}
      >
        <div>
          <div className="p-1">
            <p className="nombre-materia">{nombre}</p>
            <small className="clave-materia font-weight-bold">{clave}</small>
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

/** Componente referente al contenido de un semestre escolar. */
function Semestre({ semestre, semIdx, setMaterias }) {
  const [showNewMateria, toggleShowNewMateria] = useState(false);

  return (
    <div key={`sem-${semIdx + 1}`} className="d-flex p-1 flex-column semestre">
      <label className="mb-2">Semestre {semIdx}</label>
      {semestre.map((materia, matIdx) => (
        <Materia
          key={`sem-${semIdx}-mat-${matIdx}`}
          {...{ materia, semIdx, matIdx }}
        />
      ))}
      <div className="spacer" />
      {showNewMateria && <NewMateria {...{ toggleShowNewMateria, semIdx }} />}
      {!showNewMateria && (
        <button
          type="button"
          onClick={() => toggleShowNewMateria(true)}
          className="btn btn-light"
        >
          +
        </button>
      )}
      <button
        type="button"
        onClick={() =>
          setMaterias((m) => [...m.slice(0, semIdx), ...m.slice(semIdx + 1)])
        }
        className="remover-semestre btn btn-danger mt-2"
      >
        Remover semestre
      </button>
    </div>
  );
}

/** Componente del formulario para el nuevo plan de estudios. */
export default function PlanesForm({ plan = {}, action }) {
  const [siglas, setSiglas] = useState(plan.siglas || "");
  const [errSiglas, setErrSiglas] = useState("");

  const [nombre, setNombre] = useState(plan.nombre || "");
  const [errNombre, setErrNombre] = useState("");

  const [esVigente, setEsVigente] = useState(plan.esVigente || true);

  const [esTec21, setEsTec21] = useState(plan.esTec21 || false);

  const [materias, setMaterias] = useState(plan.materias || []);
  const [errMaterias, setErrMaterias] = useState("");

  const contextObj = { materias, setMaterias, esTec21 };

  const editMode = Object.keys(plan).length > 0;

  async function guardarPlanDeEstudios(e) {
    e.preventDefault();
    const newPlan = { siglas, nombre, esVigente, esTec21, materias };
    const resAction = await action(newPlan).catch((err) => err);
    if (resAction instanceof Error && resAction.response) {
      const { err } = resAction.response.data;
      setErrSiglas(err.siglas);
      setErrNombre(err.nombre);
      setErrMaterias(err.materias);
      return;
    }
  }

  return (
    <NewMateriaContext.Provider value={contextObj}>
      <form
        onSubmit={guardarPlanDeEstudios}
        className="planes-form container-fluid mb-4"
      >
        <div className="row">
          <div className="col- col-sm-3 form-group p-2 m-0">
            <label>Siglas:</label>
            {editMode && (
              <input
                type="text"
                autoComplete="nope"
                className="form-control"
                placeholder="Ej. [ITC11]"
                value={siglas}
                disabled
                onChange={(e) => {
                  setSiglas(e.target.value);
                  setErrSiglas("");
                }}
              />
            )}
            {!editMode && (
              <input
                type="text"
                autoComplete="nope"
                className="form-control"
                placeholder="Ej. [ITC11]"
                value={siglas}
                onChange={(e) => {
                  setSiglas(e.target.value);
                  setErrSiglas("");
                }}
              />
            )}
            <p className="text-danger">{errSiglas}</p>
          </div>

          <div className="col- col-sm-9 form-group pl-4 pt-4 m-0">
            <div className="custom-control custom-switch">
              <input
                type="checkbox"
                className="custom-control-input"
                id="cs1"
                checked={esVigente}
                onChange={() => setEsVigente((esVigente) => !esVigente)}
              />
              <label className="custom-control-label" htmlFor="cs1">
                Plan sigue vigente
              </label>
            </div>
            <div className="custom-control custom-switch">
              <input
                type="checkbox"
                className="custom-control-input"
                id="cs2"
                checked={esTec21}
                onChange={() =>
                  setEsTec21((esTec21) => {
                    const answer = window.confirm(
                      "El cambio a un plan Tec21 hará que se remuevan las materias debido a la ausencia de periodos para cada una. ¿Continuar?"
                    );
                    if (answer) {
                      setMaterias([]);
                      return !esTec21;
                    } else {
                      return esTec21;
                    }
                  })
                }
              />
              <label className="custom-control-label" htmlFor="cs2">
                Plan pertenece a Tec21
              </label>
            </div>
          </div>
        </div>

        <div className="row form-group p-2">
          <label>Nombre:</label>
          <input
            type="text"
            autoComplete="nope"
            className="form-control"
            placeholder="Ej. [Ingeniería en Tecnologías Computacionales]"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              setErrNombre("");
            }}
          />
          <p className="text-danger">{errNombre}</p>
        </div>

        <div className="row mb-3 justify-content-center">
          <div className="row semestre-container w-100">
            {materias.map((semestre, semIdx) => (
              <Semestre
                key={`sem-${semIdx + 1}`}
                {...{ semestre, semIdx, setMaterias }}
              />
            ))}
            <button
              type="button"
              onClick={() => setMaterias((materias) => [...materias, []])}
              className="btn btn-sm btn-outline-light nuevo-semestre flex-grow-1"
            >
              Nuevo Semestre
            </button>
          </div>
          <p className="text-danger col-12">{errMaterias}</p>
        </div>

        <div className="row bottom-buttons">
          <button type="submit" className="btn btn-lg bg-primary text-light">
            Guardar plan de estudios
          </button>

          {editMode && (
            <button
              type="button"
              onClick={() => (window.location = "/planes")}
              className="btn btn-lg bg-danger text-light"
            >
              Cancelar cambios
            </button>
          )}
        </div>
      </form>
    </NewMateriaContext.Provider>
  );
}
