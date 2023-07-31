const router = require("express").Router();
const User = require("../users/model");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const { extraerMensajesError, getDecodedOAuthJwtGoogle } = require("../utils/functions");

require("dotenv").config();

function extraerMatricula({ email }) {
  return email.split("@")[0];
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

  const userData = getDecodedOAuthJwtGoogle(profileObj.credential);
  // console.log(userData);

  let matricula;
  try {
    matricula = extraerMatricula(userData);
  } catch (err) {
    console.error('error sacando matriucula', err)
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
      nombre: userData.given_name,
      apellido: userData.family_name,
      correo: userData.email,
      urlFoto: userData.picture,
    });
    const resSave = await newUsuario.save().catch((err) => {
      console.error('no se pudo guardar nuevo usuario', err)
      return err;
    });
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
