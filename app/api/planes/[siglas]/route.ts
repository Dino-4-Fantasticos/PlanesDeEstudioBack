import { NextResponse } from 'next/server'
import dbConnect from "../../../../lib/mongodb";
const Plan = require('../../../../models/Plan');
const Materia = require('../../../../models/Materia');

const {
  optionalStringToJSON,
  extraerMensajesError,
} = require("../../../../utils/functions");

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

export async function GET(request: Request) {
  const urls = request.url.split('/');
  const siglas = urls[urls.length - 1]

  await dbConnect();

  return await Plan.findOne({ siglas })
    .then(async plan => {
      if (!plan) {
        return NextResponse.json({ msg: "No se encontró plan registrado con estas siglas." }, { status: 400 });
      } else {
        return await plan.materiasCompletas.then(materiasCompletas => {
          const objFind = plan.toObject();
          objFind.materias = materiasCompletas;
          return NextResponse.json(objFind);
        });
      }
    })
    .catch(err => {
      console.error(err);
      return NextResponse.json({ 
        msg: "Hubo un error al obtener plan."
      }, { status: 400 })
    });
}

export async function PUT(request: Request) {
  const urls = request.url.split('/');
  const siglas = urls[urls.length - 1]
  const data = await request.json();

  await dbConnect();

  return await Plan.findOne({ siglas })
    .then(async planToUpdate => {
      if (!planToUpdate) {
        return NextResponse.json({ msg: "No se encontró plan de estudios." }, { status: 400 });
      } else {
        await guardarMaterias(data);
        for (const [key, value] of Object.entries(data)) {
          planToUpdate[key] = value;
        }
        await planToUpdate.save();
        return NextResponse.json("Plan de estudios actualizado exitosamente.");
      }
    })
    .catch(err => {
      console.error(err);
      return NextResponse.json({ 
        msg: `Hubo un error al actualizar el plan ${siglas}`
      }, { status: 400 })
    });
}

export async function DELETE(request: Request) {
  const urls = request.url.split('/');
  const siglas = urls[urls.length - 1]

  await dbConnect();

  return await Plan.findOneAndDelete({ siglas })
    .then(deletedPlan => {
      if (!deletedPlan) {
        return NextResponse.json({ msg: "No se encontró este plan de estudios." }, { status: 400 });
      } else {
        return NextResponse.json({ msg: "Plan de estudios removido exitosamente." });
      }
    })
    .catch(err => {
      console.error(err);
      return NextResponse.json({ 
        msg: `Hubo un error al borrar el plan de estudios ${siglas}`
      }, { status: 400 })
    });
}
