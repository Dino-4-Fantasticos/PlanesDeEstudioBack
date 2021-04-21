const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const schema = new Schema({
  /** Clave de la materia. [Ej. TC1018] */
  clave: {
    type: String,
    index: true,
    required: [true, "La clave de la materia es un campo obligatorio."],
    unique: true,
    uniqueCaseInsensitive: true,
    match: [
      /^[A-Z]{1,2}[0-9]{4}[A-Z]?$/,
      "La clave de materia debe contener <1 o 2 letras><4 números>[0 o 1 letra al final].",
    ],
  },

  /** Nombre de la materia. [Ej. Estructura de Datos] */
  nombre: {
    type: String,
    required: [true, "El nombre de la materia es un campo obligatorio."],
  },
});

const uniqueErrors = {
  clave: "Ya existe otra materia registrada con esta clave.",
};
schema.plugin(uniqueValidator, { message: ({ path }) => uniqueErrors[path] });

/** Materia que pueden contener múltiples planes de estudio */
const Materia = model("Materia", schema);

module.exports = Materia;
