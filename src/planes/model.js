const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Materia = require("../materias/model");

const BLOQUES_POR_SEMESTRE = 3;

const materiaSchema = new Schema(
  {
    /** Clave de la materia con la cual enlazar al modelo */
    clave: {
      type: String,
      required: [true, "La clave es obligatoria para cada materia."],
    },

    /** Periodos en los que se imparte. (Exclusivo Tec21) */
    periodos: {
      type: [Boolean],
      default: undefined,
    },
  },
  { _id: false }
);

function validacionMaterias(materias) {
  const materiasSet = new Set();
  const errores = {};
  for (const semestre of materias) {
    for (const materia of semestre) {
      const { clave, periodos } = materia;
      const erroresMateria = {};
      if (this.esTec21) {
        if (!periodos) {
          erroresMateria.periodos =
            "Los periodos en los que se imparte la materia es un campo obligatorio para cada materia dentro de un plan Tec21.";
        } else if (periodos.length !== BLOQUES_POR_SEMESTRE) {
          erroresMateria.periodos =
            "Los periodos constan de un array de 3 booleanos para indicar en qué momentos se imparte una materia.";
        }
      }
      if (materiasSet.has(clave)) {
        erroresMateria.clave =
          "Las materias deben ser únicas dentro de cada plan de estudios.";
      }
      materiasSet.add(clave);
      if (Object.keys(erroresMateria).length) {
        errores[clave] = erroresMateria;
      }
    }
  }
  if (Object.keys(errores).length) {
    throw new Error(JSON.stringify(errores));
  }
  return true;
}
const schema = new Schema({
  /** Siglas para el plan de estudios. [Ej: ITC11] */
  siglas: {
    type: String,
    index: true,
    required: [true, "Las siglas del plan de estudios son obligatorias."],
    unique: true,
    uniqueCaseInsensitive: true,
    match: [
      /^[A-Z]{2,3}[0-9]{2}$/,
      "Las siglas de la carrera deben contener <2 o 3 letras indicando carrera><2 números indicando generación>.",
    ],
  },

  /** Nombre de la carrera. [Ej. Ingeniería en Tecnologías Computacionales] */
  nombre: {
    type: String,
    required: [true, "El nombre de la carrera es un campo obligatorio."],
  },

  /** Indica si el plan de estudios continúa utilizándose */
  esVigente: {
    type: Boolean,
    default: true,
    required: [
      true,
      "Es obligatorio indicar si este plan de estudios continúa vigente o no.",
    ],
  },

  /** Indica si el plan de estudios pertenece a Tec21. */
  esTec21: {
    type: Boolean,
    default: false,
    required: [
      true,
      "Es obligatorio indicar si este plan de estudios pertenece o no a Tec21.",
    ],
  },

  /** Conjunto de semestres que indican la estructura de la carrera */
  materias: {
    type: [[materiaSchema]],
    default: undefined,
    required: [true, "Es necesario agregar materias al plan de estudios."],
    validate: validacionMaterias,
  },
});

schema.virtual("materiasCompletas").get(async function () {
  const cMaterias = [];
  for (const semestre of this.materias) {
    const cSemestre = [];
    for (const materia of semestre) {
      const { clave, periodos } = materia;
      const resMateria = await Materia.findOne({ clave }, "-_id -__v")
        .lean()
        .catch((err) => err);
      if (resMateria instanceof Error) {
        throw resMateria;
      }
      if (this.esTec21) {
        resMateria.periodos = periodos;
      }
      cSemestre.push(resMateria);
    }
    cMaterias.push(cSemestre);
  }
  return cMaterias;
});

const uniqueErrors = {
  siglas: "Ya existe otro plan de estudios registrado con estas siglas.",
};
schema.plugin(uniqueValidator, { message: ({ path }) => uniqueErrors[path] });

/** Plan de estudios tal cual ofrecido por el Tecnológico de Monterrey */
const Plan = model("Plan", schema);


module.exports = Plan;
