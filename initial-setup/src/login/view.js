import { GoogleLogin } from '@react-oauth/google';
import { login, G_CLIENT_ID } from "../../initial-setup/src/utils/auth";

import "./style.scss";

export default function LoginScreen() {
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
        <GoogleLogin
          clientId={G_CLIENT_ID}
          buttonText="Iniciar sesión"
          onSuccess={login}
          onFailure={(res) => console.log(res)}
          cookiePolicy={"single_host_origin"}
          prompt="select_account"
        />
      </div>
    </main>
  );
}
