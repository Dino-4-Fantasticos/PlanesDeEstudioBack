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
  for (const [key, obj] of Object.entries(errors)) {
    returnErrors[key] = optionalStringToJSON(obj.message);
  }
  return returnErrors;
}

module.exports = { toQueryString, optionalStringToJSON, extraerMensajesError };
