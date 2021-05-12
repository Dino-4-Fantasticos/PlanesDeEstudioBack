import axios from "axios";
import deleteIcon from "../../assets/delete_white_24dp.svg";
import editIcon from "../../assets/edit_white_24dp.svg";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const CLIENT_URL = process.env.REACT_APP_CLIENT_URL;

async function eliminarPlan(plan) {
  const confirmMessage = `Se eliminará el plan de estudios ${plan.siglas}. ¿Continuar?`;
  if (!window.confirm(confirmMessage)) return;

  const resDelete = await axios
    .delete(`${BACKEND_URL}/planes/${plan.siglas}`)
    .catch((err) => err);
  if (resDelete instanceof Error) {
    alert(resDelete.response.data.msg);
  }
  alert(resDelete.data.msg);
  window.location = "/planes";
}

/** Lista de todos los planes registrados. */
export default function PlanesSummary({ plan }) {
  return (
    <figure className="plan-summary bg-secondary">
      <a
        href={`${CLIENT_URL}/plan/${plan.siglas}`}
        target="_blank"
        rel="noreferrer"
        className="plan-content"
      >
        <div className="flex-grow-1">
          <p className="nombre">{plan.nombre}</p>
          <p className="siglas">{plan.siglas}</p>
        </div>
      </a>
      <a href={`/planes/${plan.siglas}/edit`} className="edit-button">
        <img src={editIcon} alt="delete" />
      </a>
      <button onClick={() => eliminarPlan(plan)} className="delete-button">
        <img src={deleteIcon} alt="delete" />
      </button>
    </figure>
  );
}
