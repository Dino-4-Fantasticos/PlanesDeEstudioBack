const router = require("express").Router();
const Planificado = require("./model");

const { extraerMensajesError } = require("../utils");

// CREATE
router.post("/", async (req, res) => {
  const data = req.body || {};

  // Guardar plan de estudios
  const newPlanificado = new Planificado(data);
  const resSave = await newPlanificado.save().catch((err) => err);
  if (resSave instanceof Error) {
    return res.status(400).json({
      err: extraerMensajesError(resSave),
      msg: "Hubo un error al crear personalización del plan de estudios.",
    });
  }

  return res.json("¡El plan de estudios se ha personalizado correctamente!");
});

// READ
router.get("/", async (req, res) => {
  const { query = {} } = req;
  const resFind = await Planificado.find(query)
    .lean()
    .catch((err) => err);
  if (resFind instanceof Error) {
    return res
      .status(400)
      .json({ msg: "Hubo un error al obtener planes de estudios." });
  }

  return res.json(resFind);
});

router.get("/:_id", async (req, res) => {
  const { _id } = req.params;
  const resFind = await Planificado.findById(_id)
    .lean()
    .catch((err) => err);
  if (resFind instanceof Error) {
    return res.status(400).json({ msg: "No se encontró plan planificado." });
  }

  return res.json(resFind);
});

// UPDATE
router.put("/:_id", async (req, res) => {
  const { _id } = req.params;

  const planToUpdate = await Planificado.findById(_id).catch((err) => err);
  if (planToUpdate instanceof Error) {
    return res.status(400).json({
      msg: "Hubo un error al buscar el plan planificado para actualizar.",
    });
  }

  const data = req.body;
  for (const [key, value] of Object.entries(data)) {
    planToUpdate[key] = value;
  }
  const resUpdate = await planToUpdate.save().catch((err) => err);
  if (resUpdate instanceof Error) {
    return res.status(400).json({
      err: extraerMensajesError(resUpdate),
      msg: "Hubo un error al actualizar el plan planificado.",
    });
  }

  return res.json("Plan planificado actualizado exitosamente.");
});

// DELETE
router.delete("/:_id", async (req, res) => {
  const { _id } = req.params;
  const resDelete = await Planificado.findByIdAndDelete(_id).catch(
    (err) => err
  );
  if (resDelete instanceof Error) {
    return res
      .status(400)
      .json({ msg: "No se encontró este plan planificado." });
  }

  return res.json("Plan planificado removido exitosamente.");
});

module.exports = router;
