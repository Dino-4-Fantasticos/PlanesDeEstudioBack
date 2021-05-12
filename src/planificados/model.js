const { Schema, model } = require("mongoose");

const colorMatch = [
  /^#[0-9A-Fa-f]{6}$/,
  "El color asignado debe ser una clave hexadecimal válida. [#000000].",
];

const etiquetaSchema = {
  // Nombre para identificar a la etiqueta.
  nombre: {
    type: String,
    required: [true, "Es necesario que la etiqueta tenga un nombre."],
  },
  // Color que diferenciará a la etiqueta de todas las demás.
  color: {
    type: String,
    required: [true, "Es necesario asignar un color a la etiqueta."],
    match: colorMatch,
  },
};

const materiaGuardadaSchema = {
  // Posición del color dentro de la lista de etiquetas con el que se guarda la materia. [Ej. 0]
  color: {
    type: Number,
    required: [true, "Es necesario asignar un color a la materia."],
  },

  // Clave de la materia a la cual está relacionada en el plan de estudios
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
};

const schema = new Schema({
  /** Matrícula del usuario dueño del plan planificado. [Ej. A01634310] */
  usuario: {
    type: String,
    required: [true, "Es necesario asignarle un dueño al plan planificado."],
    match: [
      /^[AL]0[0-9]{7}$/,
      "El dueño del plan de estudios se especifica con su matrícula. Esta debe cumplir con el formato completo. [Ej. A01634310].",
    ],
  },

  /** Siglas para el plan de estudios base. [Ej: ITC11] */
  siglas: {
    type: String,
    required: [true, "Las siglas del plan de estudios base son obligatorias."],
    match: [
      /^[A-Z]{2,3}[0-9]{2}$/,
      "Las siglas de la carrera deben contener <2 o 3 letras indicando carrera><2 números indicando generación>. Ej: [ITC11].",
    ],
  },

  /** Nombre del plan planificado. [Ej. Plan por si todo sale bien] */
  nombre: {
    type: String,
    required: [true, "Es necesario indicar el nombre del plan planificado."],
  },

  /** Personalización en los colores que se pueden colocar en cada una de las materias. */
  etiquetas: {
    type: [etiquetaSchema],
  },

  /** Personalizaciones a las distintas materias del plan de estudios. */
  materias: {
    type: [[materiaGuardadaSchema]]
  }
});

/** Planificación específica de un plan de estudios. */
const Planificado = model("Planificado", schema);

module.exports = Planificado;
