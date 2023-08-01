const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const schema = new Schema({
  /** Clave de la materia. [Ej. TC1018] */
  clave: {
    type: String,
    index: true,
    uppercase: true,
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

  /** Horas de clase por semana. [CL - Ej. 3] */
  horasClase: {
    type: Number,
    required: false,
    min: [0, "Debe ser un número mayor o igual a 0."],
  },

  /** Horas de laboratorio por semana. [L/A - Ej. 3] */
  horasLaboratorio: {
    type: Number,
    required: false,
    min: [0, "Debe ser un número mayor o igual a 0."],
  },

  /** Unidades que trae consigo la materia. [U - Ej. 8] */
  unidades: {
    type: Number,
    required: [true, "Las unidades son un campo obligatorio."],
    min: [0, "Debe ser un número mayor o igual a 0."],
  },

  /** Créditos académicos del curso. [CA - Ej. 8] */
  creditosAcademicos: {
    type: Number,
    required: false,
    min: [0, "Debe ser un número mayor o igual a 0."],
  },

  /** Unidades de carga para el curso. [UDC - Ej. 3.5] */
  unidadesDeCarga: {
    type: Number,
    required: false,
    min: [0, "Debe ser un número mayor o igual a 0."],
  },
});

const uniqueErrors = {
  clave: "Ya existe otra materia registrada con esta clave.",
};
schema.plugin(uniqueValidator, { message: ({ path }) => uniqueErrors[path] });

/** Materia que pueden contener múltiples planes de estudio */
const Materia = model("Materia", schema);

module.exports = Materia;
