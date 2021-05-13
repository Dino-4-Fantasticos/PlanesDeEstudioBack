const router = require("express").Router();
const User = require("../users/model");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const { extraerMensajesError } = require("../utils/functions");

require("dotenv").config();

function extraerMatricula({ email }) {
  return email.split("@")[0].toUpperCase();
}

router.post("/", cors(), async (req, res) => {
  const profileObj = req.body;
  if (!profileObj || !Object.keys(profileObj).length) {
    return res.status(400).json({
      msg: "Hubo un error al iniciar sesión.",
      err: {
        profileObj:
          "Es necesario ingresar objeto de perfil de Google Cloud Platform.",
      },
    });
  }

  let matricula;
  try {
    matricula = extraerMatricula(profileObj);
  } catch (err) {
    return res.status(400).json({
      msg: "Hubo un error al extraer matrícula del correo otorgado.",
      err: {
        correo:
          "El correo electrónico debe contener una dirección válida para extraer la matrícula.",
      },
    });
  }
  const usuarioExiste = await User.exists({ matricula }).catch((err) => err);
  if (usuarioExiste instanceof Error) {
    return res.status(400).json({
      msg: "Hubo un error al consultar si el usuario ya estaba registrado.",
      err: extraerMensajesError(usuarioExiste),
    });
  }
  if (!usuarioExiste) {
    const newUsuario = new User({
      matricula,
      nombre: profileObj.givenName,
      apellido: profileObj.familyName,
      correo: profileObj.email,
      urlFoto: profileObj.imageUrl,
    });
    const resSave = await newUsuario.save().catch((err) => err);
    if (resSave instanceof Error) {
      return res.status(400).json({
        msg: "Hubo un error al registrar al usuario.",
        err: extraerMensajesError(resSave),
      });
    }
  }

  const token = jwt.sign({ matricula }, process.env.JWT_SECRET, {
    expiresIn: "1y",
  });
  return res.json({
    msg: "Se ha iniciado sesión correctamente.",
    token,
  });
});

router.post("/auth", cors(), (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({
      msg: "Hubo un error al extraer token.",
      err: {
        token:
          "El token es obligatorio para la autenticación de sesión de usuario.",
      },
    });
  }

  try {
    const verification = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ msg: "Verificación exitosa", verification });
  } catch (error) {
    return res.status(400).json({
      msg: "Hubo un error al realizar la verificación.",
      err: { [error.name]: error.message },
    });
  }
});

module.exports = router;
