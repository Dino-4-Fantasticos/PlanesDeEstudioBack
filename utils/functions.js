// const jwt_decode = require("jwt-decode");

/** Función para convertir de un objeto a un string query para URL */
function toQueryString(query) {
  return Object.keys(query)
    .map((key) => key + "=" + query[key])
    .join("&");
}

/** Converts string to JSON object if possible, if not returns string as it is */
function optionalStringToJSON(jsonString) {
  if (typeof jsonString !== "string") {
    throw new Error("This is not a valid string.");
  }
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return jsonString;
  }
}

/** Extraer los mensajes de error de un objeto estilo Error Mongoose */
function extraerMensajesError({ errors }) {
  const returnErrors = {};
  if (errors) {
    for (const [key, obj] of Object.entries(errors)) {
      returnErrors[key] = optionalStringToJSON(obj.message);
    }
  }
  return returnErrors;
}

/**
 * @description Function to decode Google OAuth token
 * @param token: string
 * @returns ticket object
 */
const getDecodedOAuthJwtGoogle = token => {
  return token;
  // return jwt_decode(token);
}

module.exports = { toQueryString, optionalStringToJSON, extraerMensajesError, getDecodedOAuthJwtGoogle };
