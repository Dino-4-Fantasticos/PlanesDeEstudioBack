import { NextResponse } from 'next/server'
import clientPromise from "../../../lib/mongodb";

export async function GET() {
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
    return NextResponse.status(400).json({ msg: 'error' })
  }
}