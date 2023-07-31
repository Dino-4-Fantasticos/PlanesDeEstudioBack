import axios from "axios";
import Cookies from "js-cookie";
const { OAuth2Client } = require('google-auth-library')

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const G_CLIENT_ID = process.env.REACT_APP_G_CLIENT_ID;

/** Nombre de la cookie utilizada para guardar la sesión de usuario. */
const TOKEN_NAME = "pde_id_admin";

/**
 * @description Function to decode Google OAuth token
 * @param token: string
 * @returns ticket object
 */
const getDecodedOAuthJwtGoogle = async token => {
  try {
    const client = new OAuth2Client(G_CLIENT_ID)

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: G_CLIENT_ID,
    })

    return ticket
  } catch (error) {
    return { status: 500, data: error }
  }
}

function extraerMensajeErrorCliente(res) {
  const err = new Error();
  if (!res.response) {
    err.message =
      "Hubo un error de conexión con el servidor. Favor de intentarlo más tarde.";
  } else {
    err.message = res.response.data.msg;
    err.err = res.response.data.err;
  }
  return err;
}

/**
 * Llamar al back-end para autenticar sesión iniciada.
 * En caso de sesión no válida, regresa error o nulo.
 * En caso de sesión exitosa, regres información del usuario registrado.
 */
async function authenticate() {
  if (!Cookies.get(TOKEN_NAME)) return null;

  const resAuth = await axios
    .post(`${BACKEND_URL}/login/auth`, { token: Cookies.get(TOKEN_NAME) })
    .catch((err) => err);
  if (resAuth instanceof Error) {
    throw extraerMensajeErrorCliente(resAuth);
  }

  const { matricula } = resAuth.data.verification;
  const resUserGet = await axios
    .get(`${BACKEND_URL}/users/${matricula}`)
    .catch((err) => err);
  if (resUserGet instanceof Error) {
    throw extraerMensajeErrorCliente(resUserGet);
  }

  const user = resUserGet.data;
  // if (!user.esAdmin) {
  //   throw new Error("Usuario no es administrador.");
  // }

  return resUserGet.data;
}

/** Guardar la sesión en una cookie y refrescar la página. */
async function login(credentialResponse) {
  console.log('login', credentialResponse)
  const resLogin = await axios
    .post(`${BACKEND_URL}/login/`, credentialResponse)
    .catch((err) => err);
  if (resLogin instanceof Error) {
    const errMsg = resLogin.response
      ? resLogin.response.data.msg
      : "Hubo un error de conexión al servidor.";
    alert(errMsg);
    return;
  }
  Cookies.set(TOKEN_NAME, resLogin.data.token, { expires: 365 });
  window.location = "/";
}

/** Remover cookie de la sesión. */
function logout() {
  Cookies.remove(TOKEN_NAME);
  window.location = "/login";
}

export { G_CLIENT_ID, TOKEN_NAME, getDecodedOAuthJwtGoogle, authenticate, login, logout };
