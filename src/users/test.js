const supertest = require("supertest");
const app = require("../../server");
const request = supertest(app);
const { toQueryString } = require("../utils");

const User = require("./model");

const { setupDB } = require("../test-setup");
const endpointUrl = "/api/users";

// Setup Users Test Database
setupDB("users-testing");

describe("creación de usuario", () => {
  it("falla cuando faltan campos", async (done) => {
    const res = await request.post(`${endpointUrl}/`).send({});

    const status = res.status;
    expect(status).toBe(400);

    const errors = res.body.err;
    expect(errors).toMatchObject({
      nombre: "El nombre es un campo obligatorio.",
    });
    expect(errors).toMatchObject({
      matricula: "La matrícula es un campo obligatorio.",
    });
    expect(errors).toMatchObject({
      correo: "El correo electrónico es un campo obligatorio.",
    });
    expect(errors).toMatchObject({
      apellido: "El apellido es un campo obligatorio.",
    });

    done();
  });

  it("falla cuando la matrícula no tiene el formato correcto", async (done) => {
    const matriculasIncorrectas = [
      "A0", // Matrícula muy corta
      "X00000000", // Matrícula sin la letra inicial correcta
      "ABCDEFGH", // Matrícula sin números
    ];
    for (matricula of matriculasIncorrectas) {
      const res = await request.post(`${endpointUrl}/`).send({ matricula });
      const status = res.status;
      expect(status).toBe(400);
      const errors = res.body.err;
      expect(errors).toMatchObject({
        matricula:
          "La matrícula debe cumplir con el formato completo. [A0.......].",
      });
    }

    done();
  });

  it("falla cuando el correo no tiene el formato correcto", async (done) => {
    const correosIncorrectos = [
      "sindominio", // Correo sin dominio
      "@sinnombre", // Correo sin contenido antes del @
      "correo@notec", // Correo sin terminación @itesm.mx o @tec.mx
    ];
    for (correo of correosIncorrectos) {
      const res = await request.post(`${endpointUrl}/`).send({ correo });
      const status = res.status;
      expect(status).toBe(400);
      const errors = res.body.err;
      expect(errors).toMatchObject({
        correo:
          "El correo electrónico debe contener una dirección válida del ITESM. [@itesm.mx / @tec.mx].",
      });
    }

    done();
  });

  it("falla cuando se introduce un usuario previamente registrado", async (done) => {
    await request.post(`${endpointUrl}/`).send({
      nombre: "Estudiante",
      apellido: "Prueba",
      matricula: "A01234567",
      correo: "a01234567@itesm.mx",
    });
    const res = await request.post(`${endpointUrl}/`).send({
      matricula: "A01234567",
      correo: "a01234567@itesm.mx",
    });

    const status = res.status;
    expect(status).toBe(400);

    const errors = res.body.err;
    expect(errors).toMatchObject({
      matricula: "Ya existe otro usuario registrado con esta matrícula.",
      correo: "Ya existe otro usuario registrado con este correo.",
    });

    done();
  });

  it("genera campos automáticos", async (done) => {
    const res = await request.post(`${endpointUrl}/`).send({
      nombre: "Estudiante",
      apellido: "Prueba",
      matricula: "A01234567",
      correo: "a01234567@itesm.mx",
    });
    const status = res.status;
    expect(status).toBe(200);

    const user = await User.findOne({ matricula: "A01234567" });
    expect(user).toMatchObject({
      esAdmin: false,
      urlFoto: "https://i.stack.imgur.com/YaL3s.jpg",
    });

    done();
  });

  it("guarda correctamente los datos", async (done) => {
    const res = await request.post(`${endpointUrl}/`).send({
      nombre: "Estudiante",
      apellido: "Prueba",
      matricula: "A01234567",
      correo: "a01234567@itesm.mx",
      esAdmin: true,
      urlFoto: "https://custom-image-url.jpg",
    });
    const status = res.status;
    expect(status).toBe(200);

    const user = await User.findOne({ matricula: "A01234567" });
    expect(user).toMatchObject({
      nombre: "Estudiante",
      apellido: "Prueba",
      matricula: "A01234567",
      correo: "a01234567@itesm.mx",
      esAdmin: true,
      urlFoto: "https://custom-image-url.jpg",
    });

    done();
  });
});

describe("lectura de usuarios", () => {
  beforeEach(async () => {
    const newUser01 = new User({
      nombre: "Estudiante 01",
      apellido: "Prueba",
      matricula: "A00000001",
      correo: "a00000001@itesm.mx",
    });
    const newUser02 = new User({
      nombre: "Estudiante 02",
      apellido: "Prueba",
      matricula: "A00000002",
      correo: "a00000002@itesm.mx",
      esAdmin: true,
    });
    const newUser03 = new User({
      nombre: "Profesor",
      apellido: "Prueba",
      matricula: "L00000003",
      correo: "profesor@tec.mx",
    });
    await Promise.all([newUser01.save(), newUser02.save(), newUser03.save()]);
  });

  it("consigue correctamente todos los usuarios registrados", async (done) => {
    const res = await request.get(`${endpointUrl}/`);
    const status = res.status;
    expect(status).toBe(200);

    const users = res.body;
    expect(users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          nombre: "Estudiante 01",
          apellido: "Prueba",
          matricula: "A00000001",
          correo: "a00000001@itesm.mx",
        }),
        expect.objectContaining({
          nombre: "Estudiante 02",
          apellido: "Prueba",
          matricula: "A00000002",
          correo: "a00000002@itesm.mx",
        }),
        expect.objectContaining({
          nombre: "Profesor",
          apellido: "Prueba",
          matricula: "L00000003",
          correo: "profesor@tec.mx",
        }),
      ])
    );

    done();
  });

  it("regresa una lista vacía al aplicar una consulta que ningún usuario cumple", async (done) => {
    const query = toQueryString({ apellido: "Apellido No Registrado" });
    const res = await request.get(`${endpointUrl}?${query}`);

    const status = res.status;
    expect(status).toBe(200);

    const usuarios = res.body;
    expect(usuarios).toEqual([]);

    done();
  });

  it("aplica consulta de usuarios registrados", async (done) => {
    const query = toQueryString({ esAdmin: true });
    const res = await request.get(`${endpointUrl}?${query}`);

    const status = res.status;
    expect(status).toBe(200);

    const usuarios = res.body;
    expect(usuarios).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          nombre: "Estudiante 02",
          apellido: "Prueba",
          matricula: "A00000002",
          correo: "a00000002@itesm.mx",
          esAdmin: true,
        }),
      ])
    );

    done();
  });

  it("regresa error al intentar conseguir usuario en específico no registrado", async (done) => {
    const matriculaNoRegistrada = "A99999999";
    const res = await request.get(`${endpointUrl}/${matriculaNoRegistrada}`);

    const status = res.status;
    expect(status).toBe(400);

    const error = res.body;
    expect(error).toMatchObject({
      msg: "No se encontró usuario registrado.",
    });

    done();
  });

  it("consigue correctamente un usuario en específico", async (done) => {
    const res = await request.get(`${endpointUrl}/A00000001`);
    const status = res.status;
    expect(status).toBe(200);

    const usuario = res.body;
    expect(usuario).toMatchObject({
      nombre: "Estudiante 01",
      apellido: "Prueba",
      matricula: "A00000001",
      correo: "a00000001@itesm.mx",
    });

    done();
  });
});
