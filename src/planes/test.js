const supertest = require("supertest");
const app = require("../../server");
const request = supertest(app);
const { toQueryString } = require("../utils/functions");

const Plan = require("./model");
const Materia = require("../materias/model");

const { setupDB } = require("../test-setup");
const endpointUrl = "/api/planes";

// Setup Users Test Database
setupDB("planes-testing");

const cargaAcademicaEjemplo = {
  horasClase: 3,
  horasLaboratorio: 0,
  unidades: 8,
  creditosAcademicos: 3,
  unidadesDeCarga: 3.5,
};
const materiaEjemplo01 = {
  clave: "TC1018",
  nombre: "Estructura de Datos",
  horasClase: 3,
  horasLaboratorio: 0,
  unidades: 8,
  creditosAcademicos: 3,
  unidadesDeCarga: 3.5,
};
const materiaEjemplo02 = {
  clave: "F1005",
  nombre: "Electricidad y magnetismo",
  horasClase: 3,
  horasLaboratorio: 1,
  unidades: 8,
  creditosAcademicos: 3,
  unidadesDeCarga: 4.7,
};
const materiaEjemplo03 = {
  clave: "H1040",
  nombre: "Análisis y expresión verbal",
  horasClase: 5,
  horasLaboratorio: 0,
  unidades: 8,
  creditosAcademicos: 3,
  unidadesDeCarga: 5.8,
};
const materiasEjemplo = [
  [materiaEjemplo01, materiaEjemplo02],
  [materiaEjemplo03],
];

describe("creación de plan de estudios", () => {
  it("regresa errores cuando faltan campos", async () => {
    const resPost01 = await request.post(`${endpointUrl}/`).send({});
    const {
      status: status01,
      body: { err: errors01 },
    } = resPost01;
    expect(status01).toBe(400);
    expect(errors01).toEqual({
      siglas: "Las siglas del plan de estudios son obligatorias.",
      nombre: "El nombre de la carrera es un campo obligatorio.",
      materias: "Es necesario agregar materias al plan de estudios.",
    });

    const resPost02 = await request.post(`${endpointUrl}/`).send({
      materias: materiasEjemplo,
    });
    const {
      status: status02,
      body: { err: errors02 },
    } = resPost02;
    expect(status02).toBe(400);
    expect(errors02).toEqual({
      siglas: "Las siglas del plan de estudios son obligatorias.",
      nombre: "El nombre de la carrera es un campo obligatorio.",
    });
  });

  it("regresa errores cuando las siglas no tienen el formato correcto", async () => {
    const siglasIncorrectas = [
      "I11", // Siglas sin suficientes letras iniciales
      "ITC", // Siglas sin generación
      "ITC19PRO", // Siglas con letras al final
    ];
    for (const siglas of siglasIncorrectas) {
      const resPost = await request
        .post(`${endpointUrl}/`)
        .send({ siglas, materias: materiasEjemplo });
      const status = resPost.status;
      expect(status).toBe(400);
      const errors = resPost.body.err;
      expect(errors).toMatchObject({
        siglas:
          "Las siglas de la carrera deben contener <2 o 3 letras indicando carrera><2 números indicando generación>.",
      });
    }
  });

  it("regresa errores cuando se introduce un plan de estudios previamente registrado", async () => {
    await request.post(`${endpointUrl}/`).send({
      siglas: "ITC11",
      nombre: "Ingeniería en Tecnologías Computacionales",
      materias: materiasEjemplo,
    });
    const resPost = await request.post(`${endpointUrl}/`).send({
      siglas: "ITC11",
      nombre: "Ingeniería en Tecnologías Computacionales",
      materias: materiasEjemplo,
    });

    const status = resPost.status;
    expect(status).toBe(400);

    const errors = resPost.body.err;
    expect(errors).toMatchObject({
      siglas: "Ya existe otro plan de estudios registrado con estas siglas.",
    });
  });

  it("regresa errores cuando se envían materias no válidas", async () => {
    const materiaSinClave = { nombre: "Estructura de Datos" };
    const materiaSinNombre = { clave: "TC1018" };
    const materiaClaveNoValida = {
      clave: "ClaveNoVálida",
      nombre: "Estructura de Datos",
    };
    const resPost = await request.post(`${endpointUrl}/`).send({
      siglas: "ITC11",
      nombre: "Ingeniería en Tecnologías Computacionales",
      materias: [[materiaSinClave, materiaSinNombre], [materiaClaveNoValida]],
    });

    const status = resPost.status;
    expect(status).toBe(400);

    const errors = resPost.body.err;
    expect(errors).toMatchObject({
      materias: {
        TC1018: { nombre: "El nombre de la materia es un campo obligatorio." },
        misc: [
          { clave: "La clave de la materia es un campo obligatorio." },
          {
            clave:
              "La clave de materia debe contener <1 o 2 letras><4 números>[0 o 1 letra al final].",
          },
        ],
      },
    });
  });

  it("regresa errores cuando hay materias repetidas entre sí", async () => {
    const materiaRepetida = {
      clave: "TC1018",
      nombre: "Estructura de Datos",
      horasClase: 3,
      horasLaboratorio: 0,
      unidades: 8,
      creditosAcademicos: 3,
      unidadesDeCarga: 3.5,
    };
    const resPost = await request.post(`${endpointUrl}/`).send({
      siglas: "ITC11",
      nombre: "Ingeniería en Tecnologías Computacionales",
      materias: [[materiaRepetida, materiaRepetida]],
    });

    const status = resPost.status;
    expect(status).toBe(400);

    const errors = resPost.body.err;
    expect(errors).toMatchObject({
      materias: {
        TC1018: {
          clave:
            "Las materias deben ser únicas dentro de cada plan de estudios.",
        },
      },
    });
  });

  it("regresa errores cuando un plan Tec21 no incluye periodos para sus materias o estos no tienen el formato correcto", async () => {
    const materiaSinPeriodos = {
      clave: "H1018",
      nombre: "Ética, Persona y Sociedad",
      ...cargaAcademicaEjemplo,
    };
    const materiaConPeriodosNoValidos = {
      clave: "TC1018",
      nombre: "Estructura de Datos",
      periodos: [],
      ...cargaAcademicaEjemplo,
    };
    const resPost = await request.post(`${endpointUrl}/`).send({
      siglas: "ITC11",
      nombre: "Ingeniería en Tecnologías Computacionales",
      esTec21: true,
      materias: [[materiaSinPeriodos, materiaConPeriodosNoValidos]],
    });

    const status = resPost.status;
    expect(status).toBe(400);

    const errors = resPost.body.err;
    expect(errors).toMatchObject({
      materias: {
        H1018: {
          periodos:
            "Los periodos en los que se imparte la materia es un campo obligatorio para cada materia dentro de un plan Tec21.",
        },
        TC1018: {
          periodos:
            "Los periodos constan de un array de 3 booleanos para indicar en qué momentos se imparte una materia.",
        },
      },
    });
  });

  it("guarda correctamente las materias", async () => {
    const resPost = await request.post(`${endpointUrl}/`).send({
      siglas: "ITC11",
      nombre: "Ingeniería en Tecnologías Computacionales",
      materias: materiasEjemplo,
      ...cargaAcademicaEjemplo,
    });

    const status = resPost.status;
    expect(status).toBe(200);

    const materias = await Materia.find().lean();
    expect(materias).toEqual(
      expect.arrayContaining([
        expect.objectContaining(materiaEjemplo01),
        expect.objectContaining(materiaEjemplo02),
        expect.objectContaining(materiaEjemplo03),
      ])
    );
  });

  it("genera campos automáticos", async () => {
    const resPost = await request.post(`${endpointUrl}/`).send({
      siglas: "ITC11",
      nombre: "Ingeniería en Tecnologías Computacionales",
      materias: materiasEjemplo,
      ...cargaAcademicaEjemplo,
    });

    const status = resPost.status;
    expect(status).toBe(200);

    const plan = await Plan.findOne({ siglas: "ITC11" }).lean();
    expect(plan).toMatchObject({
      esVigente: true,
      esTec21: false,
    });
  });

  it("guarda correctamente los datos", async () => {
    const resPost = await request.post(`${endpointUrl}/`).send({
      siglas: "ITC11",
      nombre: "Ingeniería en Tecnologías Computacionales",
      materias: materiasEjemplo,
      ...cargaAcademicaEjemplo,
    });

    const status = resPost.status;
    expect(status).toBe(200);

    const plan = await Plan.findOne({ siglas: "ITC11" }).lean();
    expect(plan).toMatchObject({
      siglas: "ITC11",
      nombre: "Ingeniería en Tecnologías Computacionales",
      esVigente: true,
      esTec21: false,
      materias: [
        [{ clave: materiaEjemplo01.clave }, { clave: materiaEjemplo02.clave }],
        [{ clave: materiaEjemplo03.clave }],
      ],
    });
  });
});

describe("lectura de planes de estudio", () => {
  beforeEach(async () => {
    const newPlan01 = new Plan({
      siglas: "ITC11",
      nombre: "Ingeniería en Tecnologías Computacionales",
      materias: [[{ clave: materiaEjemplo01.clave }]],
      ...cargaAcademicaEjemplo,
    });
    const newPlan02 = new Plan({
      siglas: "ITC19",
      nombre: "Ingeniería en Tecnologías Computacionales",
      esTec21: true,
      materias: [
        [{ clave: materiaEjemplo02.clave, periodos: [true, false, false] }],
      ],
      ...cargaAcademicaEjemplo,
    });
    const newPlan03 = new Plan({
      siglas: "INT11",
      nombre: "Ingeniería en Negocios y Tecnologías",
      materias: [[{ clave: materiaEjemplo03.clave }]],
      ...cargaAcademicaEjemplo,
    });
    await Promise.all([newPlan01.save(), newPlan02.save(), newPlan03.save()]);
  });

  it("consigue correctamente todos los planes de estudio", async () => {
    const resGet = await request.get(`${endpointUrl}/`);
    const { status, body: planes } = resGet;
    expect(status).toBe(200);
    expect(planes).toEqual([
      expect.objectContaining({
        siglas: "INT11",
        nombre: "Ingeniería en Negocios y Tecnologías",
      }),
      expect.objectContaining({
        siglas: "ITC11",
        nombre: "Ingeniería en Tecnologías Computacionales",
      }),
      expect.objectContaining({
        siglas: "ITC19",
        nombre: "Ingeniería en Tecnologías Computacionales",
        esTec21: true,
      }),
    ]);
  });

  it("regresa una lista vacía al aplicar una consulta que ningún plan de estudios cumple", async () => {
    const query = toQueryString({ siglas: "siglasNoRegistradas" });
    const resGet = await request.get(`${endpointUrl}?${query}`);
    const { status, body: planes } = resGet;
    expect(status).toBe(200);
    expect(planes).toEqual([]);
  });

  it("aplica consulta de planes de estudios", async () => {
    const query = toQueryString({ esTec21: true });
    const resGet = await request.get(`${endpointUrl}?${query}`);
    const { status, body: planes } = resGet;
    expect(status).toBe(200);
    expect(planes).toEqual([
      expect.objectContaining({
        siglas: "ITC19",
        nombre: "Ingeniería en Tecnologías Computacionales",
        esTec21: true,
      }),
    ]);
  });

  it("regresa error al intentar conseguir plan en específico no registrado", async () => {
    const resGet = await request.get(`${endpointUrl}/siglasNoRegistradas`);
    const { status, body: error } = resGet;
    expect(status).toBe(400);
    expect(error).toMatchObject({
      msg: "No se encontró plan registrado con estas siglas.",
    });
  });

  it("consigue correctamente un plan de estudios en específico", async () => {
    const resGet = await request.get(`${endpointUrl}/ITC11`);
    const { status, body: plan } = resGet;
    expect(status).toBe(200);
    expect(plan).toMatchObject({
      siglas: "ITC11",
      nombre: "Ingeniería en Tecnologías Computacionales",
      materias: [[{ clave: materiaEjemplo01.clave }]],
    });
  });
});

describe("actualización de planes de estudio", () => {
  const planData = {
    siglas: "ITC11",
    nombre: "Ingeniería en Tecnologías Computacionales",
    materias: [[{ clave: materiaEjemplo01.clave }]],
  };

  beforeEach(async () => {
    const newPlan = new Plan(planData);
    await newPlan.save();
  });

  it("regresa errores al intentar actualizar un plan de estudios no existente", async () => {
    const nuevosDatos = {};
    const resPut = await request
      .put(`${endpointUrl}/siglasNoRegistradas`)
      .send(nuevosDatos);
    const { status, body } = resPut;
    expect(status).toBe(400);
    expect(body).toEqual({
      msg: "No se encontró plan de estudios.",
    });
  });

  it("regresa errores en caso de remover información obligatoria", async () => {
    const resPut = await request
      .put(`${endpointUrl}/ITC11`)
      .send({ siglas: null, nombre: null, esVigente: null, esTec21: null });
    const { status, body } = resPut;
    expect(status).toBe(400);
    expect(body.err).toEqual({
      siglas: "Las siglas del plan de estudios son obligatorias.",
      nombre: "El nombre de la carrera es un campo obligatorio.",
      esVigente:
        "Es obligatorio indicar si este plan de estudios continúa vigente o no.",
      esTec21:
        "Es obligatorio indicar si este plan de estudios pertenece o no a Tec21.",
    });
  });

  it("regresa errores en caso de siglas no válidas", async () => {
    const resPut = await request
      .put(`${endpointUrl}/ITC11`)
      .send({ siglas: "siglasNoVálidas" });
    const { status, body } = resPut;
    expect(status).toBe(400);
    expect(body.err).toMatchObject({
      siglas:
        "Las siglas de la carrera deben contener <2 o 3 letras indicando carrera><2 números indicando generación>.",
    });
  });

  it("regresa errores cuando se actualiza con materias no válidas", async () => {
    const materiaSinDatos = {};
    const materiaClaveNoValida = {
      clave: "ClaveNoVálida",
      nombre: "Estructura de Datos",
    };
    const resPut = await request.put(`${endpointUrl}/ITC11`).send({
      materias: [[materiaSinDatos], [materiaClaveNoValida]],
    });
    const { status, body } = resPut;
    expect(status).toBe(400);
    expect(body.err).toMatchObject({
      materias: {
        misc: [
          { clave: "La clave de la materia es un campo obligatorio." },
          {
            clave:
              "La clave de materia debe contener <1 o 2 letras><4 números>[0 o 1 letra al final].",
          },
        ],
      },
    });
  });

  it("regresa errores cuando hay materias repetidas entre sí", async () => {
    const materiaRepetida = {
      clave: materiaEjemplo01.clave,
      nombre: "NombreMateria",
      ...cargaAcademicaEjemplo,
    };
    const resPut = await request
      .put(`${endpointUrl}/ITC11`)
      .send({ materias: [[materiaRepetida, materiaRepetida]] });
    const { status, body } = resPut;
    expect(status).toBe(400);
    expect(body.err).toMatchObject({
      materias: {
        [materiaEjemplo01.clave]: {
          clave:
            "Las materias deben ser únicas dentro de cada plan de estudios.",
        },
      },
    });
  });

  it("regresa errores cuando un plan Tec21 no incluye periodos para sus materias o estos no tienen el formato correcto", async () => {
    const materiaSinPeriodos = materiaEjemplo01;
    const materiaConPeriodosNoValidos = {
      ...materiaEjemplo02,
      periodos: [],
    };
    const resPut = await request.put(`${endpointUrl}/ITC11`).send({
      esTec21: true,
      materias: [[materiaSinPeriodos, materiaConPeriodosNoValidos]],
    });
    const { status, body } = resPut;
    expect(status).toBe(400);
    expect(body.err).toMatchObject({
      materias: {
        [materiaEjemplo01.clave]: {
          periodos:
            "Los periodos en los que se imparte la materia es un campo obligatorio para cada materia dentro de un plan Tec21.",
        },
        [materiaEjemplo02.clave]: {
          periodos:
            "Los periodos constan de un array de 3 booleanos para indicar en qué momentos se imparte una materia.",
        },
      },
    });
  });

  it("guarda correctamente las nuevas materias agregadas", async () => {
    const nuevaMateria = materiaEjemplo02;
    const resPut = await request.put(`${endpointUrl}/ITC11`).send({
      siglas: "ITC11",
      nombre: "Ingeniería en Tecnologías Computacionales",
      materias: [[materiaEjemplo01, nuevaMateria]],
    });
    const { status } = resPut;
    expect(status).toBe(200);
    const materias = await Materia.find().lean();
    expect(materias).toEqual(
      expect.arrayContaining([expect.objectContaining(nuevaMateria)])
    );
  });

  it("regresa errores en caso de actualizar hacia un plan ya registrado", async () => {
    const siglasRepetidas = "ITC19";
    const otroPlan = new Plan({
      siglas: siglasRepetidas,
      nombre: "Ingeniería en Tecnologías Computacionales",
      materias: materiasEjemplo,
    });
    await otroPlan.save();

    const resPut = await request
      .put(`${endpointUrl}/ITC11`)
      .send({ siglas: siglasRepetidas });
    const { status, body } = resPut;
    expect(status).toBe(400);
    expect(body.err).toMatchObject({
      siglas: "Ya existe otro plan de estudios registrado con estas siglas.",
    });
  });

  it("actualiza correctamente el plan de estudios", async () => {
    const siglasActualizadas = "ITC21";
    const nuevosDatos = {
      siglas: siglasActualizadas,
      nombre: "Nombre Actualizado",
      esVigente: false,
      esTec21: true,
      materias: [[{ ...materiaEjemplo02, periodos: [true, true, false] }]],
    };
    const resPut = await request.put(`${endpointUrl}/ITC11`).send(nuevosDatos);
    const { status } = resPut;
    expect(status).toBe(200);
    const planActualizado = await Plan.findOne({
      siglas: siglasActualizadas,
    }).lean();
    expect(planActualizado).toMatchObject({
      siglas: siglasActualizadas,
      nombre: "Nombre Actualizado",
      esVigente: false,
      esTec21: true,
      materias: [
        [{ clave: materiaEjemplo02.clave, periodos: [true, true, false] }],
      ],
    });
  });
});

describe("remover plan de estudios", () => {
  const planPrevioSiglas = "ITC11";

  beforeEach(async () => {
    const newPlan = new Plan({
      siglas: planPrevioSiglas,
      nombre: "Ingeniería en Tecnologías Computacionales",
      materias: [[{ clave: materiaEjemplo01.clave }]],
    });
    await newPlan.save();
  });

  it("regresa error al intentar remover un plan de estudio no existente", async () => {
    const resDelete = await request.delete(`${endpointUrl}/siglasNoExistentes`);
    const { status, body } = resDelete;
    expect(status).toBe(400);
    expect(body).toMatchObject({
      msg: "No se encontró este plan de estudios.",
    });
  });

  it("remueve correctamente un plan de estudios determinado", async () => {
    const resDelete = await request.delete(
      `${endpointUrl}/${planPrevioSiglas}`
    );
    const { status } = resDelete;
    const plan = await Plan.findOne({ siglas: planPrevioSiglas });
    expect(status).toBe(200);
    expect(plan).toBeNull();
  });
});
