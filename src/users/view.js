import React, { useEffect, useState } from "react";
import axios from "axios";
import manageAccountsIcon from "../assets/manage_accounts_white_24dp.svg";
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
  const confirmMessage = esAdmin
    ? `Se añadirá al usuario ${matricula} a los administradores.`
    : `Se removerá al usuario ${matricula} de los administradores.`;
  if (!window.confirm(confirmMessage)) return;

  const resPut = await axios
    .put(`${BACKEND_URL}/users/${matricula}`, { esAdmin })
    .catch((err) => err);
  if (resPut instanceof Error) {
    alert(resPut.message);
    return;
  }
  window.location.reload();
}

function UsuarioSummary({ usuario }) {
  const { matricula, nombre, apellido, urlFoto, esAdmin } = usuario;

  return (
    <div className="card usuario-summary bg-secondary mb-2 d-flex flex-row p-2">
      <img
        src={urlFoto}
        alt="foto perfil"
        className="foto-perfil"
        width={48}
        height={48}
      />
      <p className="m-0 flex-grow-1 ml-2">
        {nombre} {apellido}
      </p>
      {esAdmin && (
        <img
          src={manageAccountsIcon}
          alt="manage-account"
          width={48}
          className="cursor-pointer"
          onClick={() => setAdmin(matricula, false)}
        />
      )}
      {!esAdmin && (
        <img
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

  useEffect(() => fetchUsuarios(setUsuarios), []);

  return (
    <main id="usuarios-index" className="container">
      <p className="text-right">Administrador:</p>
      {usuarios.map((usuario) => (
        <UsuarioSummary key={usuario.matricula} {...{ usuario }} />
      ))}
    </main>
  );
}
