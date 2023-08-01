import { NextResponse } from 'next/server'

export async function GET() {
  // const res = await fetch('https://data.mongodb-api.com/...', {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'API-Key': process.env.DATA_API_KEY,
  //   },
  // })
  // const data = await res.json()

  return NextResponse.json([{
    siglas: "LCMD17",
    nombre: "Licenciatura en Comunicación y Medios Digitales",
    esVigente: true,
    esTec21: false,
  }])
}