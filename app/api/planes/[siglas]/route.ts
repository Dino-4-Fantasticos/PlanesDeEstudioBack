import { NextResponse } from 'next/server'
import dbConnect from "../../../../lib/mongodb";
const Plan = require('../../../../models/Plan');


export async function GET(request: Request) {
  // console.log(request);
  // console.log(request.url);
  const urls = request.url.split('/');
  const siglas = urls[urls.length - 1]
  // console.log(siglas);

  await dbConnect();

  // return NextResponse.json({});
  try {
    const planes = await Plan.findOne({ siglas }) /* find all the data in our database */
    return NextResponse.json(planes);
  } catch (error) {
    return NextResponse.json({ message: 'database error' }, { status: 400 })
  }
}