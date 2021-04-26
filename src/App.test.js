import React from "react";
import { render } from "@testing-library/react";

import App from "./App";

it("react default test", () => {
  const { getByText } = render(<App />);

  expect(getByText("Learn React")).toBeInTheDocument();
});
