import { NextResponse } from 'next/server'
import clientPromise from "../../../../lib/mongodb";

export async function GET(request: Request) {
  // console.log(request);
  // console.log(request.url);
  const urls = request.url.split('/');
  const siglas = urls[urls.length - 1]
  // console.log(siglas);


  // return NextResponse.json({});
  try {
    const client = await clientPromise;
    const db = client.db("PDE");

    const plan = await db
        .collection("plans")
        .findOne({ siglas })

    return NextResponse.json(plan);
  } catch (e) {
    console.error(e);
    return NextResponse.status(400).json({ msg: 'error' })
  }
}