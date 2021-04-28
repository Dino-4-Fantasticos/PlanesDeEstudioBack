const supertest = require("supertest");
const app = require("../../server");
const request = supertest(app);
const { toQueryString } = require("../utils");

const Planificado = require("./model");

const { setupDB } = require("../test-setup");
const endpointUrl = "/api/planificados";

// Setup Users Test Database
setupDB("planes-testing");

const usuarioEjemplo = "A01634310";
const siglasEjemplo = "ITC11";
const nombreEjemplo = "Plan de estudios ejemplo";
const etiquetasEjemplo = [
  { color: "#439630", nombre: "Este semestre" },
  { color: "#2653ad", nombre: "Siguiente semestre" },
];
const materiasEjemplo = {
  TC1018: { color: "#439630" },
  H1018: { color: "#2653ad" },
};

const planificadoEjemplo = {
  usuario: usuarioEjemplo,
  siglas: siglasEjemplo,
  nombre: nombreEjemplo,
  materias: materiasEjemplo,
  etiquetas: etiquetasEjemplo,
};

/** Función que remueve los campos indicados. */
function purgarCampos(plan, campos = ["etiquetas", "materias"]) {
  for (const campo of campos) {
    delete plan[campo];
  }
  return plan;
}

describe("creación de plan planificado", () => {
  it("regresa errores cuando faltan campos", async () => {
    const resPost = await request.post(`${endpointUrl}/`).send({});
    const {
      status,
      body: { err: errors },
    } = resPost;
    expect(status).toBe(400);
    expect(errors).toMatchObject({
      usuario: "Es necesario asignarle un dueño al plan planificado.",
      siglas: "Las siglas del plan de estudios base son obligatorias.",
      nombre: "Es necesario indicar el nombre del plan planificado.",
    });
  });

  it("regresa errores cuando se introducen datos con formato incorrecto", async () => {
    const resPost = await request
      .post(`${endpointUrl}/`)
      .send({ siglas: "siglasNoVálidas", usuario: "MatrículaNoVálida" });
    const {
      status,
      body: { err: errors },
    } = resPost;

    expect(status).toBe(400);
    expect(errors).toMatchObject({
      usuario:
        "El dueño del plan de estudios se especifica con su matrícula. Esta debe cumplir con el formato completo. [Ej. A01634310].",
      siglas:
        "Las siglas de la carrera deben contener <2 o 3 letras indicando carrera><2 números indicando generación>. Ej: [ITC11].",
    });
  });

  it("regresa errores cuando se agregan etiquetas no válidas", async () => {
    const resPost01 = await request.post(`${endpointUrl}/`).send({
      etiquetas: [{ color: "#439630" }],
    });
    const {
      status: status01,
      body: { err: errors01 },
    } = resPost01;
    expect(status01).toBe(400);
    expect(errors01).toMatchObject({
      "etiquetas.0.nombre": "Es necesario que la etiqueta tenga un nombre.",
    });

    const resPost02 = await request.post(`${endpointUrl}/`).send({
      usuario: usuarioEjemplo,
      nombre: nombreEjemplo,
      materias: materiasEjemplo,
      etiquetas: [{ nombre: "Para el próximo semestre", color: null }],
    });
    const {
      status: status02,
      body: { err: errors02 },
    } = resPost02;
    expect(status02).toBe(400);
    expect(errors02).toMatchObject({
      "etiquetas.0.color": "Es necesario asignar un color a la etiqueta.",
    });

    const resPost03 = await request.post(`${endpointUrl}/`).send({
      usuario: usuarioEjemplo,
      nombre: nombreEjemplo,
      materias: materiasEjemplo,
      etiquetas: [
        { nombre: "Para el próximo semestre", color: "ColorNoVálido" },
      ],
    });
    const {
      status: status03,
      body: { err: errors03 },
    } = resPost03;
    expect(status03).toBe(400);
    expect(errors03).toMatchObject({
      "etiquetas.0.color":
        "El color asignado debe ser una clave hexadecimal válida. [#000000].",
    });
  });

  it("regresa errores cuando se agregan materias no válidas", async () => {
    const resPost01 = await request.post(`${endpointUrl}/`).send({
      materias: { TC1018: { color: null } },
    });
    const {
      status: status01,
      body: { err: errors01 },
    } = resPost01;
    expect(status01).toBe(400);
    expect(errors01).toMatchObject({
      "materias.TC1018.color": "Es necesario asignar un color a la materia.",
    });

    const resPost02 = await request.post(`${endpointUrl}/`).send({
      materias: { TC1018: { color: "ColorNoVálido" } },
    });
    const {
      status: status02,
      body: { err: errors02 },
    } = resPost02;
    expect(status02).toBe(400);
    expect(errors02).toMatchObject({
      "materias.TC1018.color":
        "El color asignado debe ser una clave hexadecimal válida. [#000000].",
    });
  });

  it("guarda correctamente los datos", async () => {
    const resPost = await request
      .post(`${endpointUrl}/`)
      .send(planificadoEjemplo);
    const { status } = resPost;
    expect(status).toBe(200);
    const planificado = await Planificado.find({
      usuario: usuarioEjemplo,
    }).lean();
    expect(planificado).toMatchObject([planificadoEjemplo]);
  });
});

describe("lectura de planes de estudio", () => {
  const planificado01 = {
    usuario: "A01634310",
    siglas: "ITC11",
    nombre: "Plan perfecto",
  };
  const planificado02 = {
    usuario: "A01634310",
    siglas: "INT17",
    nombre: "Plan para los campeones",
    etiquetas: [{ nombre: "Ya cursadas", color: "#439630" }],
  };
  const planificado03 = {
    usuario: "A00768429",
    siglas: "ITC11",
    nombre: "Plan por si repruebo",
    etiquetas: [{ nombre: "Por cursar", color: "#2653ad" }],
    materias: { TC1018: { color: "#439630" } },
  };

  beforeEach(async () => {
    const newPlan01 = new Planificado(planificado01);
    const newPlan02 = new Planificado(planificado02);
    const newPlan03 = new Planificado(planificado03);
    await Promise.all([newPlan01.save(), newPlan02.save(), newPlan03.save()]);
  });

  it("consigue correctamente todos los planes planificados", async () => {
    const resGet = await request.get(`${endpointUrl}/`);
    const { status, body: planes } = resGet;
    expect(status).toBe(200);

    expect(planes).toEqual(
      expect.arrayContaining([
        expect.objectContaining(purgarCampos(planificado01)),
        expect.objectContaining(purgarCampos(planificado02)),
        expect.objectContaining(purgarCampos(planificado03)),
      ])
    );
  });

  it("regresa una lista vacía al aplicar una consulta que ningún plan planificado cumple", async () => {
    const query = toQueryString({ siglas: "siglasNoRegistradas" });
    const resGet = await request.get(`${endpointUrl}?${query}`);
    const { status, body: planes } = resGet;
    expect(status).toBe(200);
    expect(planes).toEqual([]);
  });

  it("aplica consulta de planes de estudios", async () => {
    const query = toQueryString({ usuario: "A01634310" });
    const resGet = await request.get(`${endpointUrl}?${query}`);
    const { status, body: planes } = resGet;
    expect(status).toBe(200);
    expect(planes).toEqual(
      expect.arrayContaining([
        expect.objectContaining(purgarCampos(planificado01)),
        expect.objectContaining(purgarCampos(planificado02)),
      ])
    );
  });

  it("regresa error al intentar conseguir plan planificado en específico no registrado", async () => {
    const resGet = await request.get(`${endpointUrl}/idNoExistente`);
    const { status, body: error } = resGet;
    expect(status).toBe(400);
    expect(error).toMatchObject({
      msg: "No se encontró plan planificado.",
    });
  });

  it("consigue correctamente un plan planificado en específico", async () => {
    const newPlanData = {
      usuario: "A01634310",
      siglas: "ITC11",
      nombre: "Plan por si apruebo algoritmos",
    };
    const newPlan = new Planificado(newPlanData);
    await newPlan.save();

    const resGet = await request.get(`${endpointUrl}/${newPlan._id}`);
    const { status, body: plan } = resGet;
    expect(status).toBe(200);
    expect(plan).toMatchObject(newPlanData);
  });
});

describe("actualización de planes de estudio", () => {
  let planificadoId;

  beforeEach(async () => {
    const newPlanificado = new Planificado(planificadoEjemplo);
    await newPlanificado.save();
    planificadoId = newPlanificado._id;
  });

  it("regresa errores al intentar actualizar un plan planificado no existente", async () => {
    const nuevosDatos = {};
    const resPut = await request
      .put(`${endpointUrl}/idNoRegistrada`)
      .send(nuevosDatos);
    const {
      status,
      body: { msg: errorMessage },
    } = resPut;

    expect(status).toBe(400);
    expect(errorMessage).toEqual(
      "Hubo un error al buscar el plan planificado para actualizar."
    );
  });

  it("regresa errores en caso de remover información obligatoria", async () => {
    const nuevosDatos = {
      usuario: null,
      siglas: null,
      nombre: null,
    };
    const resPut = await request
      .put(`${endpointUrl}/${planificadoId}`)
      .send(nuevosDatos);
    const {
      status,
      body: { err: errors },
    } = resPut;

    expect(status).toBe(400);
    expect(errors).toMatchObject({
      usuario: "Es necesario asignarle un dueño al plan planificado.",
      siglas: "Las siglas del plan de estudios base son obligatorias.",
      nombre: "Es necesario indicar el nombre del plan planificado.",
    });
  });

  it("regresa errores en caso de datos no válidos", async () => {
    const nuevosDatos = {
      usuario: "matrículaNoVálida",
      siglas: "siglasNoVálidas",
    };
    const resPut = await request
      .put(`${endpointUrl}/${planificadoId}`)
      .send(nuevosDatos);
    const {
      status,
      body: { err: errors },
    } = resPut;

    expect(status).toBe(400);
    expect(errors).toMatchObject({
      usuario:
        "El dueño del plan de estudios se especifica con su matrícula. Esta debe cumplir con el formato completo. [Ej. A01634310].",
      siglas:
        "Las siglas de la carrera deben contener <2 o 3 letras indicando carrera><2 números indicando generación>. Ej: [ITC11].",
    });
  });

  it("regresa errores en caso de agregar etiquetas no válidas", async () => {
    const nuevosDatos = {
      etiquetas: [{ nombre: null, color: "colorNoVálido" }],
    };
    const resPut = await request
      .put(`${endpointUrl}/${planificadoId}`)
      .send(nuevosDatos);
    const {
      status,
      body: { err: errors },
    } = resPut;

    expect(status).toBe(400);
    expect(errors).toMatchObject({
      "etiquetas.0.nombre": "Es necesario que la etiqueta tenga un nombre.",
      "etiquetas.0.color":
        "El color asignado debe ser una clave hexadecimal válida. [#000000].",
    });
  });

  it("regresa errores en caso de agregar materias no válidas", async () => {
    const nuevosDatos01 = { materias: { TC1018: { color: null } } };
    const resPut01 = await request
      .put(`${endpointUrl}/${planificadoId}`)
      .send(nuevosDatos01);
    const {
      status: status01,
      body: { err: errors01 },
    } = resPut01;
    expect(status01).toBe(400);
    expect(errors01).toMatchObject({
      "materias.TC1018.color": "Es necesario asignar un color a la materia.",
    });

    const nuevosDatos02 = { materias: { TC1018: { color: "colorNoVálido" } } };
    const resPut02 = await request
      .put(`${endpointUrl}/${planificadoId}`)
      .send(nuevosDatos02);
    const {
      status: status02,
      body: { err: errors02 },
    } = resPut02;
    expect(status02).toBe(400);
    expect(errors02).toMatchObject({
      "materias.TC1018.color":
        "El color asignado debe ser una clave hexadecimal válida. [#000000].",
    });
  });

  it("actualiza correctamente el plan planificado", async () => {
    const nuevosDatos = {
      nombre: "Nombre Actualizado",
      etiquetas: [],
      materias: { TI2011: { color: "#ABC987" } },
    };
    const resPut = await request
      .put(`${endpointUrl}/${planificadoId}`)
      .send(nuevosDatos);
    const { status } = resPut;
    expect(status).toBe(200);

    const planificadoActualizado = await Planificado.findById(
      planificadoId
    ).lean();
    expect(planificadoActualizado).toMatchObject(nuevosDatos);
  });
});

describe("remover plan planificado", () => {
  beforeEach(async () => {
    const newPlanificado = new Planificado(planificadoEjemplo);
    await newPlanificado.save();
  });

  it("regresa error al intentar remover un plan de estudio no existente", async () => {
    const resDelete = await request.delete(`${endpointUrl}/idNoRegistrada`);
    const {
      status,
      body: { msg: errorMessage },
    } = resDelete;
    expect(status).toBe(400);
    expect(errorMessage).toEqual("No se encontró este plan planificado.");
  });

  it("remueve correctamente un plan planificado determinado", async () => {
    const newPlanData = {
      usuario: "A01634310",
      siglas: "ITC11",
      nombre: "Plan por si apruebo algoritmos",
    };
    const newPlan = new Planificado(newPlanData);
    await newPlan.save();

    const resDelete = await request.delete(`${endpointUrl}/${newPlan._id}`);
    const { status } = resDelete;
    expect(status).toBe(200);
    const planificado = await Planificado.findById(newPlan._id);
    expect(planificado).toBeNull();
  });
});
