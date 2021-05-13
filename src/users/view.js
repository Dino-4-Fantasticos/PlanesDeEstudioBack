import React, { useEffect, useState } from "react";
import axios from "axios";
import manageAccountsIcon from "../assets/manage_accounts_white_24dp.svg";
import { stringsMatch } from "../utils/functions.es6";
import "./style.scss";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

async function fetchUsuarios(setUsuarios) {
  const resGet = await axios.get(`${BACKEND_URL}/users`).catch((err) => err);
  if (resGet instanceof Error) {
    alert(resGet.message);
    setUsuarios([]);
    return;
  }
  setUsuarios(resGet.data);
}

async function setAdmin(matricula, esAdmin) {
  const resPut = await axios
    .put(`${BACKEND_URL}/users/${matricula}`, { esAdmin })
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
  return (
    <div className="card usuario-summary bg-secondary mb-2 d-flex flex-row p-2">
      <img
        src={usuario.urlFoto}
        alt="foto perfil"
        className="foto-perfil"
        width={48}
        height={48}
      />
      <div className="m-0 flex-grow-1 ml-2 user-info">
        <p className="m-0 ml-2 nombre">
          {usuario.nombre} {usuario.apellido}
        </p>
        <small className="m-0 ml-2 matricula">{usuario.matricula}</small>
      </div>
      {usuario.esAdmin && (
        <img
          src={manageAccountsIcon}
          alt="manage-account"
          width={48}
          className="cursor-pointer"
          onClick={() => setAdmin(usuario.matricula, false)}
        />
      )}
      {!usuario.esAdmin && (
        <img
          src={manageAccountsIcon}
          alt="manage-account"
          width={48}
          height={48}
          className="cursor-pointer blurred"
          onClick={() => setAdmin(usuario.matricula, true)}
        />
      )}
    </div>
  );
}

export default function UsuariosIndex() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => fetchUsuarios(setUsuarios), []);
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
