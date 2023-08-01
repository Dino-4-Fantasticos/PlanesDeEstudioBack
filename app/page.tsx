import '../styles/panel_admin.scss';
import Link from 'next/link';

export default function Home() {
  return (
    <main id="panel-admin" className="container">
      <div className="row justify-content-around">
        <Link href="/planes" className="col-8 col-md-5 m-3">
          <button className="btn btn-primary btn-lg p-4">
            Planes de Estudio
          </button>
        </Link>
        <Link href="/usuarios" className="col-8 col-md-5 m-3">
          <button className="btn btn-info btn-lg p-4">
            Usuarios y Administradores
          </button>
        </Link>
      </div>
    </main>
  )
}
