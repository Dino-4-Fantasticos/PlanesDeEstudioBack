import { NextResponse } from 'next/server'
import dbConnect from "../../../lib/mongodb";
const User = require("../../../models/User");

export async function POST(request: Request) {
  const data = await request.json();

  await dbConnect();

  const newUser = new User(data);
  const resSave = await newUser.save().catch((err) => err);
  if (resSave instanceof Error) {
    for (const [key, obj] of Object.entries(resSave.errors)) {
      resSave.errors[key] = obj.properties.message;
    }
    return NextResponse
      .json({ err: resSave.errors, msg: "Hubo un error al crear el usuario." }, { status: 400 });
  }

  return NextResponse.json("¡El usuario se ha registrado correctamente!");
}

export async function GET(request: Request) {
  await dbConnect();

  // const { query = {} } = req;
  const query = {};
  const resFind = await User.find(query)
    .sort("matricula")
    .lean()
    .catch((err) => err);
  if (resFind instanceof Error) {
    return NextResponse.json({ msg: "Hubo un error al obtener usuarios." }, { status: 400 });
  }

  return NextResponse.json(resFind);
}
