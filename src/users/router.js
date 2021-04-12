const router = require("express").Router();
const User = require("./model");

// CREATE
router.post("/", async (req, res) => {
  const data = req.body || {};
  const newUser = new User(data);
  const resSave = await newUser.save().catch((err) => err);
  if (resSave instanceof Error) {
    for (const [key, obj] of Object.entries(resSave.errors)) {
      resSave.errors[key] = obj.properties.message;
    }
    return res
      .status(400)
      .json({ err: resSave.errors, msg: "Hubo un error al crear el usuario." });
  }

  return res.json("¡El usuario se ha registrado correctamente!");
});

// READ
router.get("/", async (req, res) => {
  const { query = {} } = req;
  const resFind = await User.find(query).catch((err) => err);
  if (resFind instanceof Error) {
    return res.status(400).json({ msg: "Hubo un error al obtener usuarios." });
  }

  return res.json(resFind);
});

router.get("/:matricula", async (req, res) => {
  const { matricula } = req.params;
  const resFind = await User.findOne({ matricula }).catch((err) => err);
  if (resFind instanceof Error) {
    return res.status(400).json({ msg: "Hubo un error al obtener usuario." });
  }
  if (resFind === null) {
    return res.status(400).json({ msg: "No se encontró usuario registrado." });
  }

  return res.json(resFind);
});

// UPDATE
router.put("/:matricula", async (req, res) => {
  const { matricula } = req.params;
  const userToUpdate = await User.findOne({ matricula }).catch((err) => err);
  if (userToUpdate instanceof Error) {
    return res
      .status(400)
      .json({ msg: "Hubo un error al actualizar el usuario." });
  }
  if (userToUpdate === null) {
    return res.status(400).json({ msg: "No se encontró usuario registrado." });
  }

  const data = req.body;
  for (const [key, value] of Object.entries(data)) {
    userToUpdate[key] = value;
  }
  const resUpdate = await userToUpdate.save().catch((err) => err);
  if (resUpdate instanceof Error) {
    for (const [key, obj] of Object.entries(resUpdate.errors)) {
      resUpdate.errors[key] = obj.properties.message;
    }
    return res.status(400).json({
      err: resUpdate.errors,
      msg: "Hubo un error al actualizar el usuario.",
    });
  }

  return res.json("Usuario actualizado exitosamente.");
});

module.exports = router;
