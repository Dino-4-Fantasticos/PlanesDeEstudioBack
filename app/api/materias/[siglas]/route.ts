import { NextResponse } from 'next/server'
import clientPromise from "../../../../lib/mongodb";

export async function GET(request: Request) {
  // console.log(request);
  // console.log(request.url);
  const urls = request.url.split('/');
  const clave = urls[urls.length - 1]
  // console.log(siglas);

  // console.log(NextResponse)


  // return NextResponse.json({});
  try {
    const client = await clientPromise;
    const db = client.db("PDE");

    const materia = await db
        .collection("materias")
        .findOne({ clave })

    console.log(materia);
    
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

  } catch (e) {
    console.error(e);
    return NextResponse.json({
      message: "error"
    }, {
      status: 400,
    })
  }
}