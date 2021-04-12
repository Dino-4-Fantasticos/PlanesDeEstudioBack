const supertest = require("supertest");
const app = require("../../server");
const request = supertest(app);

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
