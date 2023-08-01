const router = require("express").Router();
const Plan = require("./model");
const Materia = require("../materias/model");
const cors = require("cors");

const {
  optionalStringToJSON,
  extraerMensajesError,
} = require("../utils/functions");

function containsErrors(res) {
  if (!res) return false;
  if (!res.errors) return false;
  if (Object.keys(res.errors).length === 0) return false;
  return true;
}

/** Guardar cada una de las materias en la base de datos */
async function guardarMaterias(data) {
  const { materias = [] } = data;

  const errores = {};
  for (const semestre of materias) {
    for (const materia of semestre) {
      const { clave } = materia;
      const materiaToUpdate = await Materia.findOne({ clave }).exec();
      if (!materiaToUpdate) {
        const newMateria = new Materia(materia);
        const resSaveMateria = await newMateria.save().catch((err) => err);
        if (resSaveMateria instanceof Error) {
          const mensajesError = extraerMensajesError(resSaveMateria);
          if (clave && !("clave" in mensajesError)) {
            errores[clave] = mensajesError;
          } else {
            if (!errores.misc) errores.misc = [];
            errores.misc.push(mensajesError);
          }
        }
      } else {
        for (const [key, value] of Object.entries(materia)) {
          materiaToUpdate[key] = value;
        }
        const resUpdate = await materiaToUpdate.save().catch((err) => err);
        if (resUpdate instanceof Error) {
          const mensajesError = extraerMensajesError(resUpdate);
          if (clave && !("clave" in mensajesError)) {
            errores[clave] = mensajesError;
          } else {
            if (!errores.misc) errores.misc = [];
            errores.misc.push(mensajesError);
          }
        }
      }
    }
  }
  if (Object.keys(errores).length) {
    throw new Error(JSON.stringify(errores));
  }

  return { msg: "Materias guardadas satisfactoriamente." };
}

// CREATE
router.post("/", cors(), async (req, res) => {
  const data = req.body || {};

  // Guardar materias
  const resGuardarMaterias = await guardarMaterias(data).catch((err) => {
    console.error(err);
    return err;
  });

  if (resGuardarMaterias instanceof Error) {
    return res.status(400).json({
      err: { materias: optionalStringToJSON(resGuardarMaterias.message) },
      msg: "Hubo un error al guardar las materias para crear plan de estudios.",
    });
  }

  // Guardar plan de estudios
  const newPlan = new Plan(data);
  const resSave = await newPlan.save().catch((err) => err);
  if (resSave instanceof Error) {
    return res.status(400).json({
      err: extraerMensajesError(resSave),
      msg: "Hubo un error al crear el plan de estudios.",
    });
  }

  return res.json({
    msg: "¡El plan de estudios se ha registrado correctamente!",
  });
});

// READ
router.get("/", cors(), async (req, res) => {
  const { query = {} } = req;
  const resFind = await Plan.find(query, "-materias", { sort: { siglas: 1 } })
    .lean()
    .catch((err) => err);
  if (resFind instanceof Error) {
    return res
      .status(400)
      .json({ msg: "Hubo un error al obtener planes de estudios." });
  }

  return res.json(resFind);
});

router.get("/:siglas", cors(), async (req, res) => {
  const { siglas } = req.params;
  const resFind = await Plan.findOne({ siglas }).catch((err) => err);
  if (resFind instanceof Error) {
    return res.status(400).json({ msg: "Hubo un error al obtener plan." });
  }
  if (resFind === null) {
    return res
      .status(400)
      .json({ msg: "No se encontró plan registrado con estas siglas." });
  }
  const resMatCompletas = await resFind.materiasCompletas.catch((err) => err);
  if (resMatCompletas instanceof Error) {
    return res
      .status(400)
      .json({ err: resMatCompletas, msg: "Hubo un error al obtener plan." });
  }
  const objFind = resFind.toObject();
  objFind.materias = resMatCompletas;

  return res.json(objFind);
});

// UPDATE
router.put("/:siglas", cors(), async (req, res) => {
  const { siglas } = req.params;
  const planToUpdate = await Plan.findOne({ siglas }).catch((err) => err);
  if (planToUpdate instanceof Error) {
    return res.status(400).json({
      msg: "Hubo un error al buscar el plan de estudios para actualizar.",
    });
  }
  if (planToUpdate === null) {
    return res.status(400).json({ msg: "No se encontró plan de estudios." });
  }

  const data = req.body;

  // Guardar materias
  const resGuardarMaterias = await guardarMaterias(data).catch((err) => err);
  if (resGuardarMaterias instanceof Error)
    return res.status(400).json({
      err: { materias: optionalStringToJSON(resGuardarMaterias.message) },
      msg: "Hubo un error al guardar las materias para actualizar el plan de estudios.",
    });

  for (const [key, value] of Object.entries(data)) {
    planToUpdate[key] = value;
  }
  const resUpdate = await planToUpdate.save().catch((err) => err);
  if (resUpdate instanceof Error) {
    return res.status(400).json({
      err: extraerMensajesError(resUpdate),
      msg: "Hubo un error al actualizar el plan de estudios.",
    });
  }

  return res.json("Plan de estudios actualizado exitosamente.");
});

// DELETE
router.delete("/:siglas", cors(), async (req, res) => {
  const { siglas } = req.params;
  const resDelete = await Plan.findOneAndDelete({ siglas }).catch((err) => err);
  if (resDelete instanceof Error) {
    return res
      .status(400)
      .json({ msg: "Hubo un error al remover el plan de estudios." });
  }
  if (resDelete === null) {
    return res
      .status(400)
      .json({ msg: "No se encontró este plan de estudios." });
  }

  return res.json({ msg: "Plan de estudios removido exitosamente." });
});

// VALIDATE - Ruta para validar la adición o edición de UNA materia.
router.post("/validate-materia", cors(), async (req, res) => {
  const {
    esTec21 = false,
    materias,
    semIdx,
    nuevaMateria,
    editMode,
  } = req.body;

  // Validación de nueva materia individual
  const materiaDoc = new Materia(nuevaMateria);
  let resMateriaValidate = materiaDoc.validateSync();
  const badPeriodos =
    !nuevaMateria.periodos || nuevaMateria.periodos.every((p) => !p);
  if (esTec21 && badPeriodos) {
    resMateriaValidate = resMateriaValidate || { errors: {} };
    resMateriaValidate.errors.periodos = {
      message:
        "Los periodos en los que se imparte la materia es un campo obligatorio para cada materia dentro de un plan Tec21.",
    };
  }
  const { errors: { clave: { kind } = {} } = {} } = resMateriaValidate || {};
  if (kind === "unique") {
    delete resMateriaValidate.errors.clave;
  }
  if (containsErrors(resMateriaValidate)) {
    return res.status(400).json({
      err: extraerMensajesError(resMateriaValidate),
      msg: "La nueva materia no pasó la validación.",
    });
  }

  // Validación de materia dentro del plan de estudios
  materias[semIdx].push(nuevaMateria);
  const planDoc = new Plan({ esTec21, materias });
  const resPlanValidate = await planDoc.validate().catch((err) => err);
  for (const key of Object.keys(resPlanValidate.errors))
    if (key !== "materias") delete resPlanValidate.errors[key];
  if (resPlanValidate.errors.materias) {
    const materiasErrors = optionalStringToJSON(
      resPlanValidate.errors.materias.properties.message
    );
    if (materiasErrors[nuevaMateria.clave].clave && editMode) {
      delete resPlanValidate.errors.materias;
    }
  }
  if (containsErrors(resPlanValidate)) {
    return res.status(400).json({
      err: extraerMensajesError(resPlanValidate),
      msg: "La nueva materia no pasó la validación.",
    });
  }

  return res.json({ msg: "La nueva materia pasó la validación exitosamente." });
});

module.exports = router;
