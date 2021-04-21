const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const schema = new Schema({
  /** Clave de la materia a la cual se relaciona */
  claveMateria: {
    type: String,
    required: [true, "La clave de la materia es un campo obligatorio."],
    uniqueCaseInsensitive: true,
    match: [
      /^[A-Z]{1,2}[0-9]{4}[A-Z]?$/,
      "La clave de materia debe contener <1 o 2 letras><4 números>[0 o 1 letra al final].",
    ]
  },

  /** Color de la materia. [Ej. #123ABC] */
  color: {
    type: String,
    required: [true, "El color es obligatorio para una materia Planeada."],
    match: [
      /^#[0-9A-F]{3,6}$/i,
      "La clave de la materia debe estar en formato hexadecimal"
    ]
  }
});

/** Asociación de una materia con un color dado por el usuario */
const materiaPlaneada = model("Materia", schema);

module.exports = materiaPlaneada;
