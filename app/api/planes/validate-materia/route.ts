import { NextResponse } from 'next/server'
import dbConnect from "../../../../lib/mongodb";
const Materia = require("../../../../models/Materia");
const Plan = require("../../../../models/Plan");

const {
  optionalStringToJSON,
  extraerMensajesError,
} = require("../../../../utils/functions");

function containsErrors(res) {
  if (!res) return false;
  if (!res.errors) return false;
  if (Object.keys(res.errors).length === 0) return false;
  return true;
}

export async function POST(request: Request) {
  const res = await request.json()
  const {
    esTec21 = false,
    materias,
    semIdx,
    nuevaMateria,
    editMode,
  } = res;

  await dbConnect();

  // Validación de nueva materia individual
  const materiaDoc = new Materia(nuevaMateria);
  let resMateriaValidate = materiaDoc.validateSync();
  const badPeriodos =
    !nuevaMateria.periodos || nuevaMateria.periodos.every((p) => !p);
  if (esTec21 && badPeriodos) {
    resMateriaValidate = resMateriaValidate || { errors: {} };
    resMateriaValidate.errors.periodos = {
      message:
        "Los periodos en los que se imparte la materia es un campo obligatorio para cada materia dentro de un plan Tec21.",
    };
  }
  const { errors: { clave: { kind } = {} } = {} } = resMateriaValidate || {};
  if (kind === "unique") {
    delete resMateriaValidate.errors.clave;
  }
  if (containsErrors(resMateriaValidate)) {
    return res.status(400).json({
      err: extraerMensajesError(resMateriaValidate),
      msg: "La nueva materia no pasó la validación.",
    });
  }

  // Validación de materia dentro del plan de estudios
  materias[semIdx].push(nuevaMateria);
  const planDoc = new Plan({ esTec21, materias });
  const resPlanValidate = await planDoc.validate().catch((err) => err);
  for (const key of Object.keys(resPlanValidate.errors))
    if (key !== "materias") delete resPlanValidate.errors[key];
  if (resPlanValidate.errors.materias) {
    const materiasErrors = optionalStringToJSON(
      resPlanValidate.errors.materias.properties.message
    );
    if (materiasErrors[nuevaMateria.clave].clave && editMode) {
      delete resPlanValidate.errors.materias;
    }
  }
  if (containsErrors(resPlanValidate)) {
    return NextResponse.json({
      err: extraerMensajesError(resPlanValidate),
      msg: "La nueva materia no pasó la validación.",
    }, { status: 400 });
  }

  return NextResponse.json({ msg: "La nueva materia pasó la validación exitosamente." });
}

