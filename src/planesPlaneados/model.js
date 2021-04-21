const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const materiaPlaneadaSchema = new Schema(
  {
    /** Clave de la materia con la cual enlazar al modelo */
    claveMateria: {
      type: String,
      required: [true, "La clave de la materia es un campo obligatorio."]
    },

    /** Color de la materia. [Ej. #123ABC] */
    color: {
      type: String,
      required: [true, "El color es obligatorio para una materia Planeada."]
    }
  },
  { _id: false }
);

const schema = new Schema({
  /** Matrícula del usuario. [Ej. A01634310] */
  userMatricula: {
    type: String,
    required: [true, "La matrícula es un campo obligatorio."],
    match: [
      /^[AL]0[0-9]{7}$/,
      "La matrícula debe cumplir con el formato completo. [A0.......].",
    ]
  },

  /** Siglas para el plan de estudios. [Ej: ITC11] */
  planSiglas: {
    type: String,
    required: [true, "Las siglas del plan de estudios son obligatorias."],
    uniqueCaseInsensitive: true,
    match: [
      /^[A-Z]{2,3}[0-9]{2}$/,
      "Las siglas de la carrera deben contener <2 o 3 letras indicando carrera><2 números indicando generación>.",
    ]
  },

  materiasPlaneadas: {
    type: [[materiaSchema]],,
    default: undefined,
    required: [true, "Es necesario agregar materiasPlaneadas al plan de estudios."]
    // validate: validacionMaterias TODO: Revisar si esto es necesario
  }
});

/** Plan de estudios planeado por el Usuario */
const PlanPlaneado = model("PlanPlaneado", schema);

module.exports = PlanPlaneado;
