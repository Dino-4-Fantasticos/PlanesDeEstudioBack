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

const datosCorrectos01 = {
  clave: "TC1018",
  nombre: "Estructura de Datos",
  horasClase: 3,
  horasLaboratorio: 0,
  unidades: 8,
  creditosAcademicos: 3,
  unidadesDeCarga: 3.5,
};

const datosCorrectos02 = {
  clave: "F1005",
  nombre: "Electricidad y magnetismo",
  horasClase: 3,
  horasLaboratorio: 1,
  unidades: 8,
  creditosAcademicos: 3,
  unidadesDeCarga: 4.7,
};

const datosCorrectos03 = {
  clave: "H1040",
  nombre: "Análisis y expresión verbal",
  horasClase: 5,
  horasLaboratorio: 0,
  unidades: 8,
  creditosAcademicos: 3,
  unidadesDeCarga: 5.8,
};

describe("creación de materia", () => {
  it("regresa errores cuando faltan campos", async () => {
    const nuevaMateria = new Materia({});
    const resSave = await nuevaMateria.save().catch((err) => err);
    expect(resSave).toBeInstanceOf(Error);

    const errors = {};
    for (const [key, obj] of Object.entries(resSave.errors)) {
      errors[key] = obj.properties.message;
    }
    expect(errors).toEqual({
      clave: "La clave de la materia es un campo obligatorio.",
      nombre: "El nombre de la materia es un campo obligatorio.",
      horasClase: "Las horas de clase son un campo obligatorio.",
      horasLaboratorio: "Las horas de laboratorio son un campo obligatorio.",
      unidades: "Las unidades son un campo obligatorio.",
      creditosAcademicos: "Los créditos académicos son un campo obligatorio.",
      unidadesDeCarga: "Las unidades de carga son un campo obligatorio.",
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
    const nuevaMateria01 = new Materia(datosCorrectos01);
    await nuevaMateria01.save();

    const nuevaMateria02 = new Materia(datosCorrectos01);
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
    const newMateria = new Materia(datosCorrectos01);
    await newMateria.save();

    const materia = await Materia.findOne({ clave: "TC1018" });
    expect(materia).toMatchObject(datosCorrectos01);
  });
});

describe("lectura de materias", () => {
  beforeEach(async () => {
    const newMateria01 = new Materia(datosCorrectos01);
    const newMateria02 = new Materia(datosCorrectos02);
    const newMateria03 = new Materia(datosCorrectos03);
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
        expect.objectContaining(datosCorrectos01),
        expect.objectContaining(datosCorrectos02),
        expect.objectContaining(datosCorrectos03),
      ])
    );
  });

  it("regresa una lista vacía al aplicar una consulta que ninguna materia cumple", async () => {
    const materias = await Materia.find({ clave: "ClaveNoExistente" });
    expect(materias).toEqual([]);
  });

  it("aplica consulta de materias registradas", async () => {
    const materias = await Materia.find({ clave: datosCorrectos02.clave });
    expect(materias).toEqual(
      expect.arrayContaining([expect.objectContaining(datosCorrectos02)])
    );
  });

  it("regresa nulo al intentar conseguir una materia en específico no registrada", async () => {
    const materia = await Materia.findOne({ clave: "ClaveNoExistente" });
    expect(materia).toBeNull();
  });

  it("consigue correctamente un materia en específico", async () => {
    const materia = await Materia.findOne({ clave: datosCorrectos01.clave });
    expect(materia).toMatchObject(datosCorrectos01);
  });
});

describe("actualización de materias", () => {
  beforeEach(async () => {
    const materia = new Materia(datosCorrectos01);
    await materia.save();
  });

  it("regresa errores en caso de remover información obligatoria", async () => {
    const nuevosDatos = {
      clave: null,
      nombre: null,
      horasClase: null,
      horasLaboratorio: null,
      unidades: null,
      creditosAcademicos: null,
      unidadesDeCarga: null,
    };
    const resUpdate = await updateMateria(
      datosCorrectos01.clave,
      nuevosDatos
    ).catch((err) => err);

    expect(resUpdate).toBeInstanceOf(Error);
    const errors = extractErrors(resUpdate);
    expect(errors).toEqual({
      clave: "La clave de la materia es un campo obligatorio.",
      nombre: "El nombre de la materia es un campo obligatorio.",
      horasClase: "Las horas de clase son un campo obligatorio.",
      horasLaboratorio: "Las horas de laboratorio son un campo obligatorio.",
      unidades: "Las unidades son un campo obligatorio.",
      creditosAcademicos: "Los créditos académicos son un campo obligatorio.",
      unidadesDeCarga: "Las unidades de carga son un campo obligatorio.",
    });
  });

  it("regresa errores en caso de colocar información inválida", async () => {
    const nuevosDatos = {
      clave: "ClaveNoVálida",
      horasClase: -1,
      horasLaboratorio: -1,
      unidades: -1,
      creditosAcademicos: -1,
      unidadesDeCarga: -1,
    };
    const resUpdate = await updateMateria(
      datosCorrectos01.clave,
      nuevosDatos
    ).catch((err) => err);

    expect(resUpdate).toBeInstanceOf(Error);
    const errors = extractErrors(resUpdate);
    expect(errors).toMatchObject({
      clave:
        "La clave de materia debe contener <1 o 2 letras><4 números>[0 o 1 letra al final].",
      horasClase: "Debe ser un número mayor o igual a 0.",
      horasLaboratorio: "Debe ser un número mayor o igual a 0.",
      unidades: "Debe ser un número mayor o igual a 0.",
      creditosAcademicos: "Debe ser un número mayor o igual a 0.",
      unidadesDeCarga: "Debe ser un número mayor o igual a 0.",
    });
  });

  it("regresa errores en caso de actualizar hacia una materia ya registrada", async () => {
    const otraMateria = new Materia(datosCorrectos02);
    await otraMateria.save();

    const nuevosDatos = {
      clave: datosCorrectos02.clave,
      nombre: "Bases de Datos",
    };
    const resUpdate = await updateMateria(
      datosCorrectos01.clave,
      nuevosDatos
    ).catch((err) => err);

    expect(resUpdate).toBeInstanceOf(Error);
    const errors = extractErrors(resUpdate);
    expect(errors).toMatchObject({
      clave: "Ya existe otra materia registrada con esta clave.",
    });
  });

  it("actualiza correctamente la materia", async () => {
    const nuevosDatos = {
      clave: datosCorrectos02.clave,
      nombre: datosCorrectos02.nombre,
    };
    await updateMateria(datosCorrectos01.clave, nuevosDatos);
    const materiaActualizada = await Materia.findOne({
      clave: datosCorrectos02.clave,
    });
    expect(materiaActualizada).toMatchObject(nuevosDatos);
  });
});

describe("remover de materia", () => {
  beforeEach(async () => {
    const materia = new Materia(datosCorrectos01);
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
    const { clave } = datosCorrectos01;
    await Materia.findOneAndDelete({ clave }).catch((err) => err);
    const materia = await Materia.findOne({ clave });
    expect(materia).toBeNull();
  });
});
