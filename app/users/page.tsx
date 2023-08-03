"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import manageAccountsIcon from "../../assets/manage_accounts_white_24dp.svg";
import { stringsMatch } from "../../utils/functions.es6";
import "../../styles/users.scss";
import { BACKEND_URL } from '../../utils/auth';
import Image from 'next/image';

async function fetchUsuarios(setUsuarios) {
  const resGet = await axios.get(`/api/users`).catch((err) => err);
  if (resGet instanceof Error) {
    alert(resGet.message);
    setUsuarios([]);
    return;
  }
  setUsuarios(resGet.data);
}

async function setAdmin(matricula, esAdmin) {
  const confirmMessage = esAdmin
    ? `Se añadirá al usuario ${matricula} a los administradores.`
    : `Se removerá al usuario ${matricula} de los administradores.`;
  if (!window.confirm(confirmMessage)) return;

  const resPut = await axios
    .put(`/api/users/${matricula}`, { esAdmin })
    .catch((err) => err);
  if (resPut instanceof Error) {
    alert(resPut.message);
    return;
  }
  window.location.reload();
}

/** Función para filtrar los planes de estudios. */
function filtrarUsuarios(usuarios, filtro) {
  if (filtro === "") {
    return usuarios;
  }
  return usuarios.filter(
    (u) =>
      stringsMatch(`${u.nombre} ${u.apellido}`, filtro) ||
      stringsMatch(u.matricula, filtro)
  );
}

function UsuarioSummary({ usuario }) {
  const { matricula, nombre, apellido, urlFoto, esAdmin } = usuario;

  return (
    <div className="card usuario-summary bg-secondary mb-2 d-flex flex-row p-2">
      <Image
        src={urlFoto}
        alt="foto perfil"
        className="foto-perfil"
        width={48}
        height={48}
      />
      <div className="m-0 flex-grow-1 ml-2 user-info">
        <p className="m-0 ml-2 nombre">
          {nombre} {apellido}
        </p>
        <small className="m-0 ml-2 matricula">{matricula}</small>
      </div>
      {esAdmin && (
        <Image
          src={manageAccountsIcon}
          alt="manage-account"
          width={48}
          height={48}
          className="cursor-pointer"
          onClick={() => setAdmin(matricula, false)}
        />
      )}
      {!esAdmin && (
        <Image
          src={manageAccountsIcon}
          alt="manage-account"
          width={48}
          height={48}
          className="cursor-pointer blurred"
          onClick={() => setAdmin(matricula, true)}
        />
      )}
    </div>
  );
}

export default function UsuariosIndex() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    fetchUsuarios(setUsuarios)
  }, []);
  const usuariosFiltrados = filtrarUsuarios(usuarios, filtro);

  return (
    <main id="usuarios-index" className="container">
      <p className="text-right">Administrador:</p>
      <form className="col-12 col-md-6 mt-3">
        <div className="form-group">
          <input
            type="text"
            autoComplete="nope"
            className="form-control"
            placeholder="Ej. [ITC11]"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          <label className="form-label">Filtrar por nombre o matrícula:</label>
        </div>
      </form>
      {usuariosFiltrados.map((usuario) => (
        <UsuarioSummary key={usuario.matricula} {...{ usuario }} />
      ))}
    </main>
  );
}
