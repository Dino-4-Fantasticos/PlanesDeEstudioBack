import React from "react";
import { render, waitFor, cleanup } from "@testing-library/react";
import { authenticate } from "./utils/auth";

import App from "./App";

afterEach(cleanup);

jest.mock("./utils/auth");

it("the component is properly rendered", async () => {
  const usuarioPromise = new Promise((resolve, reject) => {
    resolve({
      matricula: "A01634310",
      esAdmin: true,
      correo: "a01634310@itesm.mx",
      nombre: "Usuario",
      apellido: "De Prueba",
      urlFoto: "http://urlFotoDePrueba.com",
    });
  });
  authenticate.mockReturnValue(usuarioPromise);
  const { container } = render(<App />);
  await waitFor(() => {
    expect(container.querySelector(".spacer")).toBeInTheDocument();
  });
});
