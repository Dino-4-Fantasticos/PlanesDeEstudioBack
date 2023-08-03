import { NextResponse } from 'next/server'
import dbConnect from "../../../../lib/mongodb";
const Materia = require('../../../models/Materia');

export async function GET(request: Request) {
  const urls = request.url.split('/');
  const clave = urls[urls.length - 1];

  await dbConnect();

  return await Materia.findOne({ clave })
    .then(materia => {
      if (materia) {
        return NextResponse.json(materia);
      } else {
        console.log('pipipi')
        return NextResponse.json({
          message: "materia no encontrada"
        }, {
          status: 408,
        });
      }
    })
    .catch(error => {
      console.error(error);
      return NextResponse.json({ message: 'database error' }, { status: 400 })
    });
}