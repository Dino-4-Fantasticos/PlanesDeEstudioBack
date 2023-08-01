import axios from "axios";
import deleteIcon from "../../assets/delete_white_24dp.svg";
import editIcon from "../../assets/edit_white_24dp.svg";
import tec21Icon from "../../assets/logo-tec21.svg";
import Image from "next/image";

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
  // window.location = "/planes";
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
          <div className="d-flex">
            <p className="siglas">{plan.siglas}</p>
            {plan.esTec21 && (
              <Image src={tec21Icon} alt="Tec 21" className="tec21-label ml-2" />
            )}
          </div>
        </div>
      </a>
      <div className="d-flex icons-container">
        <a href={`/planes/${plan.siglas}/edit`} className="edit-button">
          <Image src={editIcon} alt="delete" />
        </a>
        <button onClick={() => eliminarPlan(plan)} className="delete-button">
          <Image src={deleteIcon} alt="delete" />
        </button>
      </div>
    </figure>
  );
}
