import React, { useContext } from "react";
import { Navbar, Image, Nav, Button, Container } from "react-bootstrap";

import { logout } from "../utils/auth";
import logoutIcon from "./logout_white_24dp.svg";
import { UserContext } from "../utils/context";

import "./style.scss";

/**
 * Parte superior, contiene controles de manejo de sesión y perfil
 *
 * @param {Boolean} loggedUser Indica el usuario de la sesión.
 */
export default function Header() {
  const loggedUser = useContext(UserContext);

  return (
    <Navbar
      variant="dark"
      className="header-navbar p-0 pb-4"
      expand="md"
      height={66}
    >
      <Container fluid className="fixed-top pr-3 pl-3">
        <Navbar.Brand href="/">
          <h1> Planes de Estudio -ADMIN- </h1>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="header-collapse" />
        <Navbar.Collapse id="header-collapse" className="justify-content-end">
          <Nav.Link href="/login" className="element pr-0">
            <Button onClick={logout} variant="danger" className="d-flex">
              <Image
                className="imagen-perfil"
                width={48}
                height={48}
                src={loggedUser.urlFoto}
                roundedCircle
              />
              <div className="ml-2">
                Cerrar
                <br />
                Sesión
              </div>
              <Image
                src={logoutIcon}
                width={48}
                height={48}
                alt="Cerrar sesión"
                className="ml-3"
              />
            </Button>
          </Nav.Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
