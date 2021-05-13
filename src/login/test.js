const supertest = require("supertest");
const app = require("../../server");
const request = supertest(app);
const User = require("../users/model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Setup Users Test Database
const { setupDB } = require("../test-setup");
setupDB("login-testing");

const endpointUrl = "/api/login";

describe("inicio de sesión para usuarios", () => {
  const goodProfileObj = {
    givenName: "Diego",
    familyName: "Estrada Talamantes",
    email: "a01634310@itesm.mx",
    imageUrl: "https://i.stack.imgur.com/YaL3s.jpg",
  };

  it("regresa errores cuando se envía un objeto de perfil vacío", async () => {
    const resLogin = await request.post(`${endpointUrl}/`).send({});

    const status = resLogin.status;
    expect(status).toBe(400);

    const errors = resLogin.body.err;
    expect(errors).toMatchObject({
      profileObj:
        "Es necesario ingresar objeto de perfil de Google Cloud Platform.",
    });
  });

  it("regresa errores si se incluye correo del cual no se pueda extraer una matrícula", async () => {
    const resLogin = await request
      .post(`${endpointUrl}/`)
      .send({ email: null });

    const status = resLogin.status;
    expect(status).toBe(400);

    const errors = resLogin.body.err;
    expect(errors).toEqual({
      correo:
        "El correo electrónico debe contener una dirección válida para extraer la matrícula.",
    });
  });

  it("regresa errores de creación de usuario si el objeto de perfil es incorrecto", async () => {
    const badProfileObj = {
      givenName: null,
      familyName: null,
      email: "correoNoValido",
    };
    const resLogin = await request.post(`${endpointUrl}/`).send(badProfileObj);

    const status = resLogin.status;
    expect(status).toBe(400);

    const errors = resLogin.body.err;
    expect(errors).toMatchObject({
      matricula:
        "La matrícula debe cumplir con el formato completo. [A0.......].",
      correo:
        "El correo electrónico debe contener una dirección válida del ITESM. [@itesm.mx / @tec.mx].",
      nombre: "El nombre es un campo obligatorio.",
      apellido: "El apellido es un campo obligatorio.",
    });
  });

  it("regresa token de autenticación con la matrícula encriptada", async () => {
    const resLogin = await request.post(`${endpointUrl}/`).send(goodProfileObj);

    const status = resLogin.status;
    expect(status).toBe(200);

    const { token } = resLogin.body;
    const verification = jwt.verify(token, process.env.JWT_SECRET);
    expect(verification).toMatchObject({ matricula: "A01634310" });
  });

  it("crea usuario en caso de que no estuviera registrado previamente", async () => {
    const resLogin = await request.post(`${endpointUrl}/`).send(goodProfileObj);

    const status = resLogin.status;
    expect(status).toBe(200);

    const users = await User.find().lean();
    expect(users).toEqual([
      expect.objectContaining({
        matricula: "A01634310",
        nombre: "Diego",
        apellido: "Estrada Talamantes",
        correo: "a01634310@itesm.mx",
        urlFoto: "https://i.stack.imgur.com/YaL3s.jpg",
      }),
    ]);
  });

  it("evita crear usuario en caso de que este ya estuviera registrado previamente", async () => {
    const infoUsuarioPrevio = {
      matricula: "A01634310",
      nombre: "Diego",
      apellido: "Estrada Talamantes",
      correo: "a01634310@itesm.mx",
      urlFoto: "https://i.stack.imgur.com/YaL3s.jpg",
    };
    const usuarioPrevio = new User(infoUsuarioPrevio);
    await usuarioPrevio.save();

    const resLogin = await request.post(`${endpointUrl}/`).send(goodProfileObj);

    const status = resLogin.status;
    expect(status).toBe(200);

    const users = await User.find().lean();
    expect(users).toEqual([expect.objectContaining(infoUsuarioPrevio)]);
    const usersCount = await User.countDocuments().lean();
    expect(usersCount).toBe(1);
  });
});

describe("autenticación de sesión", () => {
  it("regresa errores cuando se envía un objeto sin un token", async () => {
    const resAuth = await request.post(`${endpointUrl}/auth`).send({});

    const status = resAuth.status;
    expect(status).toBe(400);

    const errors = resAuth.body.err;
    expect(errors).toEqual({
      token:
        "El token es obligatorio para la autenticación de sesión de usuario.",
    });
  });

  it("regresa errores cuando se envía un token no válido", async () => {
    const resAuth = await request.post(`${endpointUrl}/auth`).send({
      token: "InvalidToken",
    });

    const status = resAuth.status;
    expect(status).toBe(400);

    const errors = resAuth.body.err;
    expect(errors).toEqual({ JsonWebTokenError: "jwt malformed" });
  });

  it("regresa correctamente verificación con matrícula dentro", async () => {
    const matricula = "A01634310";
    const token = jwt.sign({ matricula }, process.env.JWT_SECRET, {
      expiresIn: "1y",
    });
    const resAuth = await request.post(`${endpointUrl}/auth`).send({ token });

    const status = resAuth.status;
    expect(status).toBe(200);

    const { matricula: resMatricula } = resAuth.body.verification;
    expect(resMatricula).toEqual(matricula);
  });
});
