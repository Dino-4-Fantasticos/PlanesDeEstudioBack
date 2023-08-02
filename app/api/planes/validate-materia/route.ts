import { NextResponse } from 'next/server'
import clientPromise from "../../../../lib/mongodb";

export async function POST(request: Request) {
  console.log('validate materia', request);
  const res = await request.json()
  console.log(res);
  const {
    esTec21 = false,
    materias,
    semIdx,
    nuevaMateria,
    editMode,
  } = res;
  
  // // Validación de nueva materia individual
  // const materiaDoc = new Materia(nuevaMateria);
  // let resMateriaValidate = materiaDoc.validateSync();
  // const badPeriodos =
  //   !nuevaMateria.periodos || nuevaMateria.periodos.every((p) => !p);
  // if (esTec21 && badPeriodos) {
  //   resMateriaValidate = resMateriaValidate || { errors: {} };
  //   resMateriaValidate.errors.periodos = {
  //     message:
  //       "Los periodos en los que se imparte la materia es un campo obligatorio para cada materia dentro de un plan Tec21.",
  //   };
  // }
  // const { errors: { clave: { kind } = {} } = {} } = resMateriaValidate || {};
  // if (kind === "unique") {
  //   delete resMateriaValidate.errors.clave;
  // }
  // if (containsErrors(resMateriaValidate)) {
  //   return res.status(400).json({
  //     err: extraerMensajesError(resMateriaValidate),
  //     msg: "La nueva materia no pasó la validación.",
  //   });
  // }
  
  // // Validación de materia dentro del plan de estudios
  // materias[semIdx].push(nuevaMateria);
  // const planDoc = new Plan({ esTec21, materias });
  // const resPlanValidate = await planDoc.validate().catch((err) => err);
  // for (const key of Object.keys(resPlanValidate.errors))
  //   if (key !== "materias") delete resPlanValidate.errors[key];
  // if (resPlanValidate.errors.materias) {
  //   const materiasErrors = optionalStringToJSON(
  //     resPlanValidate.errors.materias.properties.message
  //   );
  //   if (materiasErrors[nuevaMateria.clave].clave && editMode) {
  //     delete resPlanValidate.errors.materias;
  //   }
  // }
  // if (containsErrors(resPlanValidate)) {
  //   return res.status(400).json({
  //     err: extraerMensajesError(resPlanValidate),
  //     msg: "La nueva materia no pasó la validación.",
  //   });
  // }
  
  // return res.json({ msg: "La nueva materia pasó la validación exitosamente." });
  try {
    const client = await clientPromise;
    const db = client.db("PDE");

    const planes = await db
        .collection("plans")
        .find({})
        .sort({ metacritic: -1 })
        .toArray();

    return NextResponse.json(planes);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: 'database error' }, { status: 400 })
  }
}

