const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const schema = new Schema({
  /** Matrícula del usuario. [Ej. A01634310] */
  matricula: {
    type: String,
    index: true,
    required: [true, "La matrícula es un campo obligatorio."],
    unique: true,
    uniqueCaseInsensitive: true,
    match: [
      /^[AL]0[0-9]{7}$/,
      "La matrícula debe cumplir con el formato completo. [A0.......].",
    ],
  },

  /** ¿El usuario tiene acceso a las funciones de administrador? */
  esAdmin: {
    type: Boolean,
    default: false,
  },

  /** Correo electrónico @itesm.mx / @tec.mx con el que se está registrado. [Ej: a01634310@itesm.mx] */
  correo: {
    type: String,
    required: [true, "El correo electrónico es un campo obligatorio."],
    unique: true,
    uniqueCaseInsensitive: true,
    match: [
      /^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@(?:tec.mx|itesm.mx)$/,
      "El correo electrónico debe contener una dirección válida del ITESM. [@itesm.mx / @tec.mx].",
    ],
  },

  /** Nombre(s) del usuario registrado. [Ej: Luis Alberto] */
  nombre: {
    type: String,
    required: [true, "El nombre es un campo obligatorio."],
  },

  /** Apellido(s) del usuario registrado. [Ej: Pérez Chapa] */
  apellido: {
    type: String,
    required: [true, "El apellido es un campo obligatorio."],
  },

  /** URL hacia la foto del usuario registrado. [Ej: https://lh3.googleusercontent.com/ogw/ADGmqu9O-yLWQmC4JHNEYxu4wwcCS5hdry08csylWTNW4A=s32-c-mo] */
  urlFoto: {
    type: String,
    default: "https://i.stack.imgur.com/YaL3s.jpg",
  },
});

const uniqueErrors = {
  matricula: "Ya existe otro usuario registrado con esta matrícula.",
  correo: "Ya existe otro usuario registrado con este correo.",
};
schema.plugin(uniqueValidator, { message: ({ path }) => uniqueErrors[path] });

/** Usuario del Tecnológico de Monterrey quien utiliza los servicios de la página */
const User = model("User", schema);

module.exports = User;
