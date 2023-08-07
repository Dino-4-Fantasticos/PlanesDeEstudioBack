"use client"

import "../../styles/header.scss";
import React, { useEffect } from "react";
import { Navbar, Image, Button, Container } from "react-bootstrap";
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import logoutIcon from "./logout_white_24dp.svg";

export default function Header() {
  const router = useRouter();
  const { data: session } = useSession();
  const loggedUser = session?.user;
  console.log('Header', session);

  useEffect(() => {
    if (session === null) {
      router.push('/');
    }
  }, [router, session])

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
          {loggedUser && 
            <Button onClick={() => signOut()} variant="danger" className="d-flex">
              <Image
                className="imagen-perfil"
                width={48}
                height={48}
                src={loggedUser?.image}
                roundedCircle
                alt="icono usuario"
              />
              <div className="ml-2">
                Cerrar
                <br />
                Sesión
              </div>
              <Image
                src={logoutIcon.src}
                width={48}
                height={48}
                alt="Cerrar sesión"
                className="ml-3"
              />
            </Button>
          }
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
