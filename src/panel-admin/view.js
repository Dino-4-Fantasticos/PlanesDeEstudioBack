import "./style.scss";

export default function PanelAdmin() {
  return (
    <main id="panel-admin" className="container">
      <div className="row justify-content-around">
        <a href="/planes" className="col-8 col-md-5 m-3">
          <button className="btn btn-primary btn-lg p-4">
            Planes de Estudio
          </button>
        </a>
        <a href="/usuarios" className="col-8 col-md-5 m-3">
          <button className="btn btn-info btn-lg p-4">
            Usuarios y Administradores
          </button>
        </a>
      </div>
    </main>
  );
}
