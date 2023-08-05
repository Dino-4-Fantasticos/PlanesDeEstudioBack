"use client"

import React, { useEffect } from "react";
import Link from "next/link";

import "../../styles/planes.scss";

import PlanSummary from "./plan_summary";
import usePlanes, { filtroTec21Opciones } from '../../hooks/usePlanes';

export default function PlanesIndex() {
  const { fetchPlanes, planes, filtroNombre, filtroTec21, handleUpdateFiltroNombre, handleUpdateFiltroTec21 } = usePlanes(); 

  useEffect(() => {
    fetchPlanes();
  }, [fetchPlanes]);

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
            onChange={(e) => handleUpdateFiltroNombre(e.target.value)}
          />
          <label className="form-label">Filtrar por nombre o siglas:</label>
        </div>
        <div className="form-group col-12 col-md-4">
          <select
            value={filtroTec21}
            onChange={(e) => handleUpdateFiltroTec21(e.target.value)}
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
      <div className="text-right mb-3">
        <Link href={`/planes/new`}>
          <button className="btn btn-lg btn-warning">Nuevo Plan</button>
        </Link>
      </div>
      {planes?.map((plan, idx) => (
        <PlanSummary key={`plan-${idx}`} {...{ plan }} />
      ))}
    </main>
  );
}
