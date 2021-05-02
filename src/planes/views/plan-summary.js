import axios from "axios";
import deleteIcon from "../../assets/delete_white_24dp.svg";
import editIcon from "../../assets/edit_white_24dp.svg";

import { backendURL, clientURL } from "../../utils/variables";

async function eliminarPlan(plan) {
  const resDelete = await axios
    .delete(`${backendURL}/planes/${plan.siglas}`)
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
      <a href={`${clientURL}/plan/${plan.siglas}`} className="plan-content">
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
