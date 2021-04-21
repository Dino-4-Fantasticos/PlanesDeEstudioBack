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

module.exports = { toQueryString, optionalStringToJSON };
