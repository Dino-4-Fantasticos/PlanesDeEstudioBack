"use client"

import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import githubIcon from "./github-icon.png";
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <div className="container text-center">
      <Col>
        <Row>
          <Col>
            <p>
              Creada por:
              <Link
                rel="noreferrer"
                href="https://github.com/Adrian-Garcia"
                target="_blank"
              >
                {" "}
                Adrián García
              </Link>
              ,
              <Link
                rel="noreferrer"
                href="https://github.com/alegayndra"
                target="_blank"
              >
                {" "}
                Alejandra García
              </Link>
              ,
              <Link
                rel="noreferrer"
                href="https://github.com/EstradaDiego99"
                target="_blank"
              >
                {" "}
                Diego Estrada
              </Link>
              , &
              <Link
                rel="noreferrer"
                href="https://github.com/luispc111"
                target="_blank"
              >
                {" "}
                Luis Alberto Pérez{" "}
              </Link>
            </p>
          </Col>
        </Row>
        <Row className="p-2">
          <Col>
            <Link
              rel="noreferrer"
              href="https://github.com/luispc111/PlanesDeEstudio"
              target="_blank"
            >
              <Image
                src={githubIcon}
                alt="Github link"
                width={25}
                height={25}
              />
            </Link>
          </Col>
        </Row>
      </Col>
    </div>
  );
}
