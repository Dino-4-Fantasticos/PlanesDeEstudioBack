const router = require("express").Router();
const Materia = require("./model");
const cors = require("cors");

router.get("/:clave", cors(), async (req, res) => {
  const { clave } = req.params;
  const resFind = await Materia.findOne({ clave })
    .lean()
    .catch((err) => err);
  if (resFind instanceof Error) {
    return res.status(400).json({ msg: "Hubo un error al obtener materia." });
  }
  if (resFind === null) {
    return res
      .status(400)
      .json({ msg: "No se encontró materia registrada con esta clave." });
  }
  return res.json(resFind);
});

module.exports = router;
