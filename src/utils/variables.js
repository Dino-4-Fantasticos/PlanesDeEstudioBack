/** URL used to connect to the back-end of the application, picking between the
 * appropiate both for development and for production
 */
const backendURL =
  process.env.NODE_ENV === "production"
    ? "https://planes-estudio.herokuapp.com/api"
    : "http://localhost:5000/api";

/** URL where the client is hosted */
const clientURL = "https://dino-4-fantasticos.github.io/PlanesDeEstudio/#";

export { backendURL, clientURL };
