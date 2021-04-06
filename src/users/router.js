const router = require("express").Router();
const User = require("./model");

// CREATE
router.route("/").post(async (req, res) => {
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

module.exports = router;
