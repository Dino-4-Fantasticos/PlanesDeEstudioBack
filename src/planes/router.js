const router = require("express").Router();
const Plan = require("./model");
const Materia = require("../materias/model");

const { optionalStringToJSON, extraerMensajesError } = require("../utils");

/** Guardar cada una de las materias en la base de datos */
async function guardarMaterias(data) {
  const { materias = [] } = data;

  const errores = {};
  for (const semestre of materias) {
    for (const materia of semestre) {
      const { clave, nombre } = materia;
      const alreadyExists = await Materia.exists({ clave });
      if (!alreadyExists) {
        const newMateria = new Materia({ clave, nombre });
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
      }
    }
  }
  if (Object.keys(errores).length) {
    throw new Error(JSON.stringify(errores));
  }

  return { msg: "Materias guardadas satisfactoriamente." };
}

// CREATE
router.post("/", async (req, res) => {
  const data = req.body || {};

  // Guardar materias
  const resGuardarMaterias = await guardarMaterias(data).catch((err) => err);
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

  return res.json("¡El usuario se ha registrado correctamente!");
});

// READ
router.get("/", async (req, res) => {
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

router.get("/:siglas", async (req, res) => {
  const { siglas } = req.params;
  const resFind = await Plan.findOne({ siglas })
    .lean()
    .catch((err) => err);
  if (resFind instanceof Error) {
    return res.status(400).json({ msg: "Hubo un error al obtener plan." });
  }
  if (resFind === null) {
    return res
      .status(400)
      .json({ msg: "No se encontró plan registrado con estas siglas." });
  }

  return res.json(resFind);
});

// UPDATE
router.put("/:siglas", async (req, res) => {
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
      msg:
        "Hubo un error al guardar las materias para actualizar el plan de estudios.",
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
router.delete("/:siglas", async (req, res) => {
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

  return res.json("Plan de estudios removido exitosamente.");
});

module.exports = router;
