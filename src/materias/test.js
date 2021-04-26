const { setupDB } = require("../test-setup");
const Materia = require("./model");

// Setup Materias Test Database
setupDB("materias-testing");

/** Función auxiliar que pasa manualmente cada uno de los datos y guarda el modelo */
async function updateMateria(clave, nuevosDatos) {
  const materia = await Materia.findOne({ clave });
  for (const [key, value] of Object.entries(nuevosDatos)) {
    materia[key] = value;
  }
  return await materia.save();
}

/** Función auxiliar que extrae los mensajes de error de una respuesta no válida */
function extractErrors(res) {
  const errors = {};
  for (const [key, obj] of Object.entries(res.errors)) {
    errors[key] = obj.properties.message;
  }
  return errors;
}

describe("creación de materia", () => {
  it("regresa errores cuando faltan campos", async () => {
    const nuevaMateria = new Materia({});
    const resSave = await nuevaMateria.save().catch((err) => err);
    expect(resSave).toBeInstanceOf(Error);

    const errors = {};
    for (const [key, obj] of Object.entries(resSave.errors)) {
      errors[key] = obj.properties.message;
    }
    expect(errors).toMatchObject({
      clave: "La clave de la materia es un campo obligatorio.",
    });
    expect(errors).toMatchObject({
      nombre: "El nombre de la materia es un campo obligatorio.",
    });
  });

  it("regresa errores cuando la clave no tiene el formato correcto", async () => {
    const clavesIncorrectas = [
      "1234", // Faltan letras al principio
      "TC", // Faltan números
      "TC100", // Faltan números
      "TC10000", // Números de más
      "TC1000BB", // Demasiadas letras al final
    ];
    for (const clave of clavesIncorrectas) {
      const nuevaMateria = new Materia({ clave });
      const resSave = await nuevaMateria.save().catch((err) => err);
      expect(resSave).toBeInstanceOf(Error);

      for (const [key, obj] of Object.entries(resSave.errors)) {
        resSave.errors[key] = obj.properties.message;
      }
      expect(resSave.errors).toMatchObject({
        clave:
          "La clave de materia debe contener <1 o 2 letras><4 números>[0 o 1 letra al final].",
      });
    }
  });

  it("regresa errores cuando se introduce una materia previamente registrada", async () => {
    const nuevaMateria01 = new Materia({
      clave: "TC1018",
      nombre: "Estructura de Datos",
    });
    await nuevaMateria01.save();

    const nuevaMateria02 = new Materia({
      clave: "TC1018",
      nombre: "Estructura de Datos",
    });
    const resSave = await nuevaMateria02.save().catch((err) => err);
    expect(resSave).toBeInstanceOf(Error);

    for (const [key, obj] of Object.entries(resSave.errors)) {
      resSave.errors[key] = obj.properties.message;
    }
    expect(resSave.errors).toMatchObject({
      clave: "Ya existe otra materia registrada con esta clave.",
    });
  });

  it("guarda correctamente los datos", async () => {
    const newMateria = new Materia({
      clave: "TC1018",
      nombre: "Estructura de Datos",
    });
    await newMateria.save();

    const materia = await Materia.findOne({ clave: "TC1018" });
    expect(materia).toMatchObject({
      clave: "TC1018",
      nombre: "Estructura de Datos",
    });
  });
});

describe("lectura de materias", () => {
  beforeEach(async () => {
    const newMateria01 = new Materia({
      clave: "TC1018",
      nombre: "Estructura de Datos",
    });
    const newMateria02 = new Materia({
      clave: "TC1020",
      nombre: "Bases de Datos",
    });
    const newMateria03 = new Materia({
      clave: "H1018",
      nombre: "Ética, Persona y Sociedad",
    });
    await Promise.all([
      newMateria01.save(),
      newMateria02.save(),
      newMateria03.save(),
    ]);
  });

  it("consigue correctamente todas las materias registradas", async () => {
    const materias = await Materia.find();
    expect(materias).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          clave: "TC1018",
          nombre: "Estructura de Datos",
        }),
        expect.objectContaining({
          clave: "TC1020",
          nombre: "Bases de Datos",
        }),
        expect.objectContaining({
          clave: "H1018",
          nombre: "Ética, Persona y Sociedad",
        }),
      ])
    );
  });

  it("regresa una lista vacía al aplicar una consulta que ninguna materia cumple", async () => {
    const materias = await Materia.find({ clave: "ClaveNoExistente" });
    expect(materias).toEqual([]);
  });

  it("aplica consulta de materias registradas", async () => {
    const materias = await Materia.find({ clave: "TC1020" });
    expect(materias).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          clave: "TC1020",
          nombre: "Bases de Datos",
        }),
      ])
    );
  });

  it("regresa nulo al intentar conseguir una materia en específico no registrada", async () => {
    const materia = await Materia.findOne({ clave: "ClaveNoExistente" });
    expect(materia).toBeNull();
  });

  it("consigue correctamente un materia en específico", async () => {
    const materia = await Materia.findOne({ clave: "TC1018" });
    expect(materia).toMatchObject({
      clave: "TC1018",
      nombre: "Estructura de Datos",
    });
  });
});

describe("actualización de materias", () => {
  beforeEach(async () => {
    const materia = new Materia({
      clave: "TC1018",
      nombre: "Estructura de Datos",
    });
    await materia.save();
  });

  it("regresa errores en caso de remover información obligatoria", async () => {
    const nuevosDatos = {
      clave: null,
      nombre: null,
    };
    const resUpdate = await updateMateria("TC1018", nuevosDatos).catch(
      (err) => err
    );

    expect(resUpdate).toBeInstanceOf(Error);
    const errors = extractErrors(resUpdate);
    expect(errors).toMatchObject({
      clave: "La clave de la materia es un campo obligatorio.",
    });
    expect(errors).toMatchObject({
      nombre: "El nombre de la materia es un campo obligatorio.",
    });
  });

  it("regresa errores en caso de colocar información inválida", async () => {
    const nuevosDatos = {
      clave: "ClaveNoVálida",
    };
    const resUpdate = await updateMateria("TC1018", nuevosDatos).catch(
      (err) => err
    );

    expect(resUpdate).toBeInstanceOf(Error);
    const errors = extractErrors(resUpdate);
    expect(errors).toMatchObject({
      clave:
        "La clave de materia debe contener <1 o 2 letras><4 números>[0 o 1 letra al final].",
    });
  });

  it("regresa errores en caso de actualizar hacia una materia ya registrada", async () => {
    const otraMateria = new Materia({
      clave: "TC1020",
      nombre: "Bases de Datos",
    });
    await otraMateria.save();

    const nuevosDatos = {
      clave: "TC1020",
      nombre: "Bases de Datos",
    };
    const resUpdate = await updateMateria("TC1018", nuevosDatos).catch(
      (err) => err
    );

    expect(resUpdate).toBeInstanceOf(Error);
    const errors = extractErrors(resUpdate);
    expect(errors).toMatchObject({
      clave: "Ya existe otra materia registrada con esta clave.",
    });
  });

  it("actualiza correctamente la materia", async () => {
    const nuevosDatos = {
      clave: "TC1020",
      nombre: "Bases de Datos",
    };
    await updateMateria("TC1018", nuevosDatos);
    const materiaActualizada = await Materia.findOne({ clave: "TC1020" });
    expect(materiaActualizada).toMatchObject(nuevosDatos);
  });
});

describe("remover de materia", () => {
  beforeEach(async () => {
    const materia = new Materia({
      clave: "TC1018",
      nombre: "Estructura de Datos",
    });
    await materia.save();
  });

  it("regresa errores al intentar remover una materia no registrada", async () => {
    const clave = "NoRegistrada";
    const resDelete = await Materia.findOneAndDelete({ clave }).catch(
      (err) => err
    );
    expect(resDelete).toBeNull();
  });

  it("remueve correctamente una materia en específico", async () => {
    await Materia.findOneAndDelete({ clave: "TC1018" }).catch((err) => err);
    const materia = await Materia.findOne({ clave: "TC1018" });
    expect(materia).toBeNull();
  });
});
