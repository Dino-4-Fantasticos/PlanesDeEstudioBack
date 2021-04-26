/** URL en la que la aplicación se encontrará. */
const PUBLIC_URL = process.env.PUBLIC_URL;

/** URL used to connect to the back-end of the application, picking between the
 * appropiate both for development and for production
 */
const backendURL =
  process.env.NODE_ENV === "production"
    ? "https://planes-estudio.herokuapp.com/api"
    : "http://localhost:5000/api";

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
  for (const [key, obj] of Object.entries(errors)) {
    returnErrors[key] = optionalStringToJSON(obj.message);
  }
  return returnErrors;
}

module.exports = {
  PUBLIC_URL,
  backendURL,
  toQueryString,
  optionalStringToJSON,
  extraerMensajesError,
};
