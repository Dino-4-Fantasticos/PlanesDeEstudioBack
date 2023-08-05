import { NextResponse } from 'next/server'
import dbConnect from "../../../lib/mongodb";
const Plan = require('../../../models/Plan');
const Materia = require('../../../models/Materia');

const {
  optionalStringToJSON,
  extraerMensajesError,
} = require("../../../utils/functions");

function containsErrors(res) {
  if (!res) return false;
  if (!res.errors) return false;
  if (Object.keys(res.errors).length === 0) return false;
  return true;
}

/** Guardar cada una de las materias en la base de datos */
async function guardarMaterias(data) {
  const { materias = [] } = data;

  const errores = {};
  materias.forEach(semestre => {
    semestre.forEach(async materia => {
      const { clave } = materia;
      await Materia.findOne({ clave }).exec()
        .then(async materiaToUpdate => {
          if (!materiaToUpdate) {
            new Materia(materia).save()
              .catch(err => {
                const mensajesError = extraerMensajesError(err);
                if (clave && !("clave" in mensajesError)) {
                  errores[clave] = mensajesError;
                } else {
                  if (!errores.misc) errores.misc = [];
                  errores.misc.push(mensajesError);
                }
              })
          } else {
            for (const [key, value] of Object.entries(materia)) {
              materiaToUpdate[key] = value;
            }
            const resUpdate = await materiaToUpdate.save()
              .catch(err => {
                const mensajesError = extraerMensajesError(err);
                if (clave && !("clave" in mensajesError)) {
                  errores[clave] = mensajesError;
                } else {
                  if (!errores.misc) errores.misc = [];
                  errores.misc.push(mensajesError);
                }
              });
          }
        });
    })
  });
  if (Object.keys(errores).length) {
    throw new Error(JSON.stringify(errores));
  }

  return { msg: "Materias guardadas satisfactoriamente." };
}

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

  return await guardarMaterias(data)
    .then(async materia => {
      new Plan(data).save();
      return NextResponse.json({
        msg: "¡El plan de estudios se ha registrado correctamente!",
      });
    })
    .catch((err) => {
      console.error(err);
      return NextResponse.json({
        err: { materias: optionalStringToJSON(err.message) },
        msg: "Hubo un error al guardar las materias para crear plan de estudios."
      }, { status: 400 })
    });
}
