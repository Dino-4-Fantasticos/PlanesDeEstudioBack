import { NextResponse } from 'next/server'
import dbConnect from "../../../lib/mongodb";
const Plan = require('../../../models/Plan');

export async function GET() {
  await dbConnect();

  return await Plan.find({})
    .then(planes => {
      return NextResponse.json(planes);
    })
    .catch(error => {
      console.error(error);
      return NextResponse.json({ message: 'database error' }, { status: 400 })
    });
}

export async function POST(request: Request) {
  const data = await request.json();

  return NextResponse.json(data);
}

// router.post("/", cors(), async (req, res) => {
//   const data = req.body || {};

//   // Guardar materias
//   const resGuardarMaterias = await guardarMaterias(data).catch((err) => {
//     console.error(err);
//     return err;
//   });

//   if (resGuardarMaterias instanceof Error) {
//     return res.status(400).json({
//       err: { materias: optionalStringToJSON(resGuardarMaterias.message) },
//       msg: "Hubo un error al guardar las materias para crear plan de estudios.",
//     });
//   }

//   // Guardar plan de estudios
//   const newPlan = new Plan(data);
//   const resSave = await newPlan.save().catch((err) => err);
//   if (resSave instanceof Error) {
//     return res.status(400).json({
//       err: extraerMensajesError(resSave),
//       msg: "Hubo un error al crear el plan de estudios.",
//     });
//   }

//   return res.json({
//     msg: "¡El plan de estudios se ha registrado correctamente!",
//   });
// });