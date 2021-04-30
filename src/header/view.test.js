import React from "react";
import { render } from "@testing-library/react";

import Header from "./view";
import { UserContext } from "../utils/context";

it("renderiza header cuando se ha iniciado sesión", () => {
  const { getByText, container } = render(
    <UserContext.Provider
      value={{ urlFoto: "https://i.stack.imgur.com/YaL3s.jpg" }}
    >
      <Header />
    </UserContext.Provider>
  );

  expect(getByText("Planes de Estudio -ADMIN-")).toBeInTheDocument();

  const imagenPerfil = container.querySelector(".imagen-perfil");
  expect(imagenPerfil).toBeInTheDocument();
});
