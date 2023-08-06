import GoogleLoginButton from '@/components/googleLoginButton/GoogleLoginButton';
import '../styles/panel_admin.scss';

export default function SignIn() {
  return (
    <main id="login-screen" className="container">
      <div className="jumbotron text-center">
        <p>
          <strong>PLANES DE ESTUDIO</strong>
        </p>
        <p>Panel de Administración</p>
        <p className="redirect-text">
          Si buscar la página principal puedes redirigirte a <br />
          <a href="https://dino-4-fantasticos.github.io/PlanesDeEstudio/#/">
            https://dino-4-fantasticos.github.io/PlanesDeEstudio/#/
          </a>
        </p>
      </div>
      <div className="login-container">
        <GoogleLoginButton />
      </div>
    </main>
  )
}
