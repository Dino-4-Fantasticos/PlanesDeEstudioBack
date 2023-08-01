"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

import "../../styles/planes.scss";

import PlanSummary from "./plan_summary";
import { stringsMatch } from "../../utils/functions.es6";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const filtroTec21Opciones = {
  TODOS: "all",
  SOLO_TEC21: "tec21",
  EXCEPTO_TEC21: "noTec21",
};

async function fetchPlanes(setPlanes) {
  console.log(BACKEND_URL)
  const resGet = await axios.get(`/api/planes`).catch((err) => err);
  if (resGet instanceof Error) {
    // alert(resGet.message);
    setPlanes(null);
    return;
  }
  setPlanes(resGet.data);
}

/** Función para filtrar los planes de estudios. */
function filtrarPlanes(planes, filtroNombre, filtroTec21) {
  return planes?.filter((p) => {
    if (
      !stringsMatch(p.siglas, filtroNombre) &&
      !stringsMatch(p.nombre, filtroNombre)
    )
      return false;
    if (filtroTec21 !== filtroTec21Opciones.TODOS) {
      if (p.esTec21 && filtroTec21 === filtroTec21Opciones.EXCEPTO_TEC21)
        return false;
      if (!p.esTec21 && filtroTec21 === filtroTec21Opciones.SOLO_TEC21)
        return false;
    }
    return true;
  }) || [];
}

/** Lista de todos los planes registrados. */
export default function PlanesIndex() {
  const [planes, setPlanes] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroTec21, setFiltroTec21] = useState(filtroTec21Opciones.TODOS);

  useEffect(() => {
    fetchPlanes(setPlanes);
  }, []);

  // const pathName = window.location.pathname;
  const planesFiltrados = filtrarPlanes(planes, filtroNombre, filtroTec21);

  return (
    <main id="planes-index" className="container">
      <h1 className="w-100 text-center">Planes de estudio</h1>
      <form className="row mt-3">
        <div className="form-group col-12 col-md-8">
          <input
            type="text"
            autoComplete="nope"
            className="form-control"
            placeholder="Ej. [ITC11]"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />
          <label className="form-label">Filtrar por nombre o siglas:</label>
        </div>
        <div className="form-group col-12 col-md-4">
          <select
            value={filtroTec21}
            onChange={(e) => setFiltroTec21(e.target.value)}
            className="w-100 h-100 filtro-tec21"
          >
            <option value={filtroTec21Opciones.TODOS}>Sin filtro Tec21</option>
            <option value={filtroTec21Opciones.EXCEPTO_TEC21}>
              Previo Tec21
            </option>
            <option value={filtroTec21Opciones.SOLO_TEC21}>Solo Tec21</option>
          </select>
        </div>
      </form>
      {planesFiltrados?.map((plan, idx) => (
        <PlanSummary key={`plan-${idx}`} {...{ plan }} />
      ))}
      <div className="text-right">
        <Link href={`/planes/new`}>
          <button className="btn btn-lg btn-warning">Nuevo Plan</button>
        </Link>
      </div>
    </main>
  );
}
