const supertest = require("supertest");
const app = require("../../server");
const request = supertest(app);
const { toQueryString } = require("../utils");

const Plan = require("./model");
const Materia = require("../materias/model");

const { setupDB } = require("../test-setup");
const endpointUrl = "/api/planes";

// Setup Users Test Database
setupDB("planes-testing");

describe("creación de plan de estudios", () => {
  const materiasEjemplo = [
    [
      { clave: "TC1018", nombre: "Estructura de Datos" },
      { clave: "H1018", nombre: "Ética, Persona y Sociedad" },
    ],
    [
      { clave: "TC2017", nombre: "Análisis y Diseño de Algoritmos" },
      { clave: "TC1020", nombre: "Bases de Datos" },
    ],
  ];

  it("regresa errores cuando faltan campos", async () => {
    const resPost01 = await request.post(`${endpointUrl}/`).send({});
    const status01 = resPost01.status;
    expect(status01).toBe(400);
    const errors01 = resPost01.body.err;
    expect(errors01).toMatchObject({
      materias: "Es necesario agregar materias al plan de estudios.",
    });

    const resPost02 = await request.post(`${endpointUrl}/`).send({
      materias: materiasEjemplo,
    });
    const status02 = resPost02.status;
    expect(status02).toBe(400);
    const errors02 = resPost02.body.err;
    expect(errors02).toMatchObject({
      siglas: "Las siglas del plan de estudios son obligatorias.",
    });
    expect(errors02).toMatchObject({
      nombre: "El nombre de la carrera es un campo obligatorio.",
    });
  });

  it("regresa errores cuando las siglas no tienen el formato correcto", async () => {
    const siglasIncorrectas = [
      "I11", // Siglas sin suficientes letras iniciales
      "ITC", // Siglas sin generación
      "ITC19PRO", // Siglas con letras al final
    ];
    for (siglas of siglasIncorrectas) {
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
    const materiaRepetida = { clave: "TC1018", nombre: "Estructura de Datos" };
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
    };
    const materiaConPeriodosNoValidos = {
      clave: "TC1018",
      nombre: "Estructura de Datos",
      periodos: [],
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
      materias: [
        [
          { clave: "TC1018", nombre: "Estructura de Datos" },
          { clave: "H1018", nombre: "Ética, Persona y Sociedad" },
        ],
        [
          { clave: "TC2017", nombre: "Análisis y Diseño de Algoritmos" },
          { clave: "TC1020", nombre: "Bases de Datos" },
        ],
      ],
    });

    const status = resPost.status;
    expect(status).toBe(200);

    const materias = await Materia.find().lean();
    expect(materias).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          clave: "TC1018",
          nombre: "Estructura de Datos",
        }),
        expect.objectContaining({
          clave: "H1018",
          nombre: "Ética, Persona y Sociedad",
        }),
        expect.objectContaining({
          clave: "TC2017",
          nombre: "Análisis y Diseño de Algoritmos",
        }),
        expect.objectContaining({
          clave: "TC1020",
          nombre: "Bases de Datos",
        }),
      ])
    );
  });

  it("genera campos automáticos", async () => {
    const resPost = await request.post(`${endpointUrl}/`).send({
      siglas: "ITC11",
      nombre: "Ingeniería en Tecnologías Computacionales",
      materias: materiasEjemplo,
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
        // Las materias son guardadas en el orden en que se introdujeron
        [
          { clave: "TC1018", nombre: "Estructura de Datos" },
          { clave: "H1018", nombre: "Ética, Persona y Sociedad" },
        ],
        [
          { clave: "TC2017", nombre: "Análisis y Diseño de Algoritmos" },
          { clave: "TC1020", nombre: "Bases de Datos" },
        ],
      ],
    });
  });
});

describe("lectura de planes de estudio", () => {
  beforeEach(async () => {
    const newPlan01 = new Plan({
      siglas: "ITC11",
      nombre: "Ingeniería en Tecnologías Computacionales",
      materias: [
        [
          {
            clave: "TC1018",
            nombre: "Estructura de Datos",
          },
        ],
      ],
    });
    const newPlan02 = new Plan({
      siglas: "ITC19",
      nombre: "Ingeniería en Tecnologías Computacionales",
      esTec21: true,
      materias: [
        [
          {
            clave: "TC1018",
            nombre: "Estructura de Datos",
            periodos: [true, false, false],
          },
        ],
      ],
    });
    const newPlan03 = new Plan({
      siglas: "INT11",
      nombre: "Ingeniería en Negocios y Tecnologías",
      materias: [
        [
          {
            clave: "TI2011",
            nombre: "Evaluación y Administración de Proyectos",
          },
        ],
      ],
    });
    await Promise.all([newPlan01.save(), newPlan02.save(), newPlan03.save()]);
  });

  it("consigue correctamente todos los planes de estudio", async () => {
    const res = await request.get(`${endpointUrl}/`);
    const status = res.status;
    expect(status).toBe(200);

    const planes = res.body;
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
    const res = await request.get(`${endpointUrl}?${query}`);

    const status = res.status;
    expect(status).toBe(200);

    const planes = res.body;
    expect(planes).toEqual([]);
  });

  it("aplica consulta de planes de estudios", async () => {
    const query = toQueryString({ esTec21: true });
    const res = await request.get(`${endpointUrl}?${query}`);

    const status = res.status;
    expect(status).toBe(200);

    const planes = res.body;
    expect(planes).toEqual([
      expect.objectContaining({
        siglas: "ITC19",
        nombre: "Ingeniería en Tecnologías Computacionales",
        esTec21: true,
      }),
    ]);
  });

  it("regresa error al intentar conseguir plan en específico no registrado", async () => {
    const res = await request.get(`${endpointUrl}/siglasNoRegistradas`);

    const status = res.status;
    expect(status).toBe(400);

    const error = res.body;
    expect(error).toMatchObject({
      msg: "No se encontró plan registrado con estas siglas.",
    });
  });

  it("consigue correctamente un plan de estudios en específico", async () => {
    const res = await request.get(`${endpointUrl}/ITC11`);
    const status = res.status;
    expect(status).toBe(200);

    const plan = res.body;
    expect(plan).toMatchObject({
      siglas: "ITC11",
      nombre: "Ingeniería en Tecnologías Computacionales",
      materias: [[{ clave: "TC1018", nombre: "Estructura de Datos" }]],
    });
  });
});

/*
describe("actualización de planes de estudio", () => {
  beforeEach(async () => {
    const newPlan = new Plan({
      siglas: "ITC11",
      nombre: "Ingeniería en Tecnologías Computacionales",
      materias: [[{ clave: "TC1018", nombre: "Estructura de Datos" }]],
    });
    await newPlan.save();
  });

  it("regresa errores al intentar actualizar un plan de estudios no existente", async () => {
    const nuevosDatos = {};
    const resPut = await request
      .put(`${endpointUrl}/siglasNoRegistradas`)
      .send(nuevosDatos);

    const status = resPut.status;
    expect(status).toBe(400);

    const error = resPut.body;
    expect(error).toMatchObject({
      msg: "No se encontró plan de estudios.",
    });
  });

  it("regresa errores en caso de remover información obligatoria", async () => {
    const nuevosDatos = {
      siglas: null,
      nombre: null,
      esVigente: null,
      esTec21: null,
    };
    const resPut = await request.put(`${endpointUrl}/ITC11`).send(nuevosDatos);
    const status = resPut.status;
    expect(status).toBe(400);

    const errors = resPut.body.err;
    expect(errors).toMatchObject({
      siglas: "Las siglas del plan de estudios son obligatorias.",
      nombre: "El nombre de la carrera es un campo obligatorio.",
      esVigente:
        "Es obligatorio indicar si este plan de estudios continúa vigente o no.",
      esTec21:
        "Es obligatorio indicar si este plan de estudios pertenece o no a Tec21.",
    });
  });

  it("regresa errores en caso de siglas no válidas", async () => {
    const nuevosDatos = { siglas: "siglasNoVálidas" };
    const resPut = await request.put(`${endpointUrl}/ITC11`).send(nuevosDatos);
    const status = resPut.status;
    expect(status).toBe(400);

    const errors = resPut.body.err;
    expect(errors).toMatchObject({
      siglas:
        "Las siglas de la carrera deben contener <2 o 3 letras indicando carrera><2 números indicando generación>.",
    });
  });

  it("regresa errores cuando se actualiza con materias no válidas", async () => {
    const materiaSinClave = { nombre: "Estructura de Datos" };
    const materiaSinNombre = { clave: "TC1018" };
    const materiaClaveNoValida = {
      clave: "ClaveNoVálida",
      nombre: "Estructura de Datos",
    };
    const resPut = await request.put(`${endpointUrl}/ITC11`).send({
      materias: [[materiaSinClave, materiaSinNombre], [materiaClaveNoValida]],
    });

    const status = resPut.status;
    expect(status).toBe(400);

    const errors = resPut.body.err;
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
    const materiaRepetida = { clave: "TC1018", nombre: "Estructura de Datos" };
    const resPut = await request.put(`${endpointUrl}/ITC11`).send({
      materias: [[materiaRepetida, materiaRepetida]],
    });

    const status = resPut.status;
    expect(status).toBe(400);

    const errors = resPut.body.err;
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
    };
    const materiaConPeriodosNoValidos = {
      clave: "TC1018",
      nombre: "Estructura de Datos",
      periodos: [],
    };
    const resPut = await request.put(`${endpointUrl}/ITC11`).send({
      esTec21: true,
      materias: [[materiaSinPeriodos, materiaConPeriodosNoValidos]],
    });

    const status = resPut.status;
    expect(status).toBe(400);

    const errors = resPut.body.err;
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

  it("guarda correctamente las nuevas materias agregadas", async () => {
    const nuevaMateria = {
      clave: "H1018",
      nombre: "Ética, Persona y Sociedad",
    };
    const resPut = await request.put(`${endpointUrl}/ITC11`).send({
      siglas: "ITC11",
      nombre: "Ingeniería en Tecnologías Computacionales",
      materias: [
        [{ clave: "TC1018", nombre: "Estructura de Datos" }, nuevaMateria],
      ],
    });

    const status = resPut.status;
    expect(status).toBe(200);

    const materias = await Materia.find().lean();
    expect(materias).toEqual(
      expect.arrayContaining([expect.objectContaining(nuevaMateria)])
    );
  });

  it("regresa errores en caso de actualizar hacia un plan ya registrado", async () => {
    const otroPlan = new Plan({
      siglas: "ITC19",
      nombre: "Ingeniería en Tecnologías Computacionales",
      esTec21: true,
      materias: [
        [
          {
            clave: "TC1018",
            nombre: "Estructura de Datos",
            periodos: [true, false, false],
          },
        ],
      ],
    });
    await otroPlan.save();

    const resPut = await request.put(`${endpointUrl}/ITC11`).send({
      siglas: "ITC19",
    });
    const status = resPut.status;
    expect(status).toBe(400);

    const errors = resPut.body.err;
    expect(errors).toMatchObject({
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
      materias: [
        [
          {
            clave: "TI2011",
            nombre: "Evaluación y Administración de Proyectos",
            periodos: [true, true, false],
          },
        ],
      ],
    };
    const resPut = await request.put(`${endpointUrl}/ITC11`).send(nuevosDatos);
    const status = resPut.status;
    expect(status).toBe(200);

    const planActualizado = await Plan.findOne({
      siglas: siglasActualizadas,
    }).lean();
    expect(planActualizado).toMatchObject(nuevosDatos);
  });
});

describe("remover de usuario", () => {
  beforeEach(async () => {
    const newUser = new User({
      nombre: "Estudiante",
      apellido: "Prueba",
      matricula: "A01234567",
      correo: "a01234567@itesm.mx",
    });
    await newUser.save();
  });

  it("regresa error al intentar remover usuario en específico no registrado", async () => {
    const matriculaNoRegistrada = "A99999999";
    const res = await request.delete(`${endpointUrl}/${matriculaNoRegistrada}`);

    const status = res.status;
    expect(status).toBe(400);

    const error = res.body;
    expect(error).toMatchObject({ msg: "No se encontró usuario registrado." });
  });

  it("remueve correctamente un usuario en específico", async () => {
    const res = await request.delete(`${endpointUrl}/A01234567`);
    const status = res.status;
    expect(status).toBe(200);

    const usuario = await User.findOne({ matricula: "A00000001" });
    expect(usuario).toEqual(null);
  });
});
*/
