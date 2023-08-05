import deleteIcon from "../../assets/delete_white_24dp.svg";
import editIcon from "../../assets/edit_white_24dp.svg";
import tec21Icon from "../../assets/logo-tec21.svg";
import Image from "next/image";
import Link from "next/link";
import usePlan from '../../hooks/usePlan';

const CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_URL;

/** Lista de todos los planes registrados. */
export default function PlanesSummary({ plan }) {
  const { eliminarPlan } = usePlan();

  return (
    <figure className="plan-summary bg-secondary">
      <Link
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
      </Link>
      <div className="d-flex icons-container">
        <Link href={`/planes/${plan.siglas}`} className="edit-button">
          <Image src={editIcon} alt="delete" />
        </Link>
        <button onClick={() => eliminarPlan(plan)} className="delete-button">
          <Image src={deleteIcon} alt="delete" />
        </button>
      </div>
    </figure>
  );
}
