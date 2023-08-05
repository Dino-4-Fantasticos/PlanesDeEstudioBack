import React, { useState } from "react";
import PlanFormContext from "../../utils/form_planes_context";
import Semestre from "../../components/semestre/semestre";

/** Componente del formulario para el nuevo plan de estudios. */
export default function PlanesForm({ plan = {}, action }) {
  console.log('PlanesForm', plan)
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
    const confirmMessage = `Se guardará plan de estudios ${siglas}. ¿Continuar?`;
    if (!window.confirm(confirmMessage)) return;

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
    <PlanFormContext.Provider value={contextObj}>
      <form onSubmit={guardarPlanDeEstudios} className="planes-form mb-4">
        <div className="row">
          <div className="col- col-sm-4 col-md-3 form-group m-0">
            {editMode && (
              <input
                type="text"
                autoComplete="nope"
                className="form-control"
                value={siglas}
                style={{ backgroundColor: "#ffffffb0" }}
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
                maxLength="6"
                value={siglas}
                onChange={(e) => {
                  setSiglas(e.target.value.toUpperCase());
                  setErrSiglas("");
                }}
              />
            )}
            <label className="form-label">Siglas:</label>
            <p className="text-danger">{errSiglas}</p>
          </div>

          <div className="col- col-sm-8 col-md-9 form-group pt-3 m-0">
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

        <div className="row mt-3">
          <div className="form-group col-12 col-md-6">
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
            <label className="form-label">Nombre:</label>
            <p className="text-danger">{errNombre}</p>
          </div>
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

          <button
            type="button"
            onClick={() => {
              const confirmMessage = `¿Cancelar cambios? Se perderá la información no guardada.`;
              if (!window.confirm(confirmMessage)) return;
              window.location = "/planes";
            }}
            className="btn btn-lg bg-danger text-light"
          >
            Cancelar cambios
          </button>
        </div>
      </form>
    </PlanFormContext.Provider>
  );
}
