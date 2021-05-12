const router = require("express").Router();
const Planificado = require("./model");
const Plan = require("./../planes/model");

const { extraerMensajesError } = require("../utils/functions");

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

// CREATE DEFAULT
router.post("/crearPlanificadoBase/:siglas", async (req, res) => {
  const { siglas } = req.params;
  const { matricula } = req.body;

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

  const resPlanificado = await Planificado.find({ siglas, usuario: matricula })
    .lean()
    .catch((err) => err);
  if (resPlanificado instanceof Error) {
    return res
      .status(400)
      .json({ msg: "Hubo un error al obtener planes de estudios." });
  }

  if (resPlanificado.length > 0) {
    res.statusMessage = "Ya hay un plan creado para esta carrera."
    return res
      .status(200)
      .json({ planificado: resPlanificado, oficial: objFind });
  }

  let data = {
    usuario: matricula,
    siglas: objFind.siglas,
    nombre: objFind.nombre,
    etiquetas: [
      { color: '#BF7913', nombre: 'Completo' },
      { color: '#439630', nombre: 'Incompleto' }
    ],
    materias: objFind.materias.map(sem => sem.map(materia => ({ clave: materia.clave, color: 0 })))
  }

  // Guardar plan de estudios
  const newPlanificado = new Planificado(data);
  const resSave = await newPlanificado.save().catch((err) => err);
  if (resSave instanceof Error) {
    return res.status(400).json({
      err: extraerMensajesError(resSave),
      msg: "Hubo un error al crear personalización del plan de estudios.",
    });
  }

  res.statusMessage = '¡El plan de estudios se ha personalizado correctamente!';

  return res.status(200).json({
    planificado: newPlanificado,
    oficial: objFind
  });
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

  if (planToUpdate === null) {
    res.statusMessage = 'No se encontró el plan dado.'
    return res.status(404).json({
      msg: "No se encontró el plan dado.",
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
