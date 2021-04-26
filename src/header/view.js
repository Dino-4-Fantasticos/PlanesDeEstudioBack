import React, { useContext } from "react";
import { Navbar, Image, Nav, Button, Container } from "react-bootstrap";
import { GoogleLogin } from "react-google-login";

import { PUBLIC_URL } from "../utils";
import { login, logout, G_CLIENT_ID } from "../auth";
import logoutIcon from "./logout_white_24dp.svg";
import { UserContext } from "../context";

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
        <Navbar.Brand href={`${PUBLIC_URL}/#/`}>
          <h1> Planes de Estudio -ADMIN- </h1>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="header-collapse" />
        <Navbar.Collapse id="header-collapse" className="justify-content-end">
          {loggedUser && (
            <>
              <Nav.Link href={`${PUBLIC_URL}/#/`} className="element">
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
            </>
          )}
          {!loggedUser && (
            <div className="element">
              <GoogleLogin
                clientId={G_CLIENT_ID}
                buttonText="Iniciar sesión"
                onSuccess={login}
                onFailure={(res) => console.log(res)}
                cookiePolicy={"single_host_origin"}
                prompt="select_account"
              />
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
