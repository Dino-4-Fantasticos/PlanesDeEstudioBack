/** Lista de todos los planes registrados. */
export default function PlanesSummary({ plan }) {
  return (
    <figure className="plan-summary">
      <p>{plan.nombre}</p>
    </figure>
  );
}
