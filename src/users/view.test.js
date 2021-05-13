import React from "react";
import { render, screen } from "@testing-library/react";

import Users from "./view";

it("renderea texto de la vista", () => {
    render(<Users />);

    const admin = screen.getByText(/Administrador:/);
  
    expect(admin).toBeInTheDocument();
  });