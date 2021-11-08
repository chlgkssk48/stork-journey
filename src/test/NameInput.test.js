import React from "react";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";

import NameInput from "../components/NameInput";

describe("NameInput Component Test", () => {
  afterEach(cleanup);

  test("Render input element", () => {
    render(<NameInput
      onType={() => {}}
      onKeyUp={() => {}}
    />);

    const nameInput = screen.getByRole("textbox");

    expect(nameInput).toBeInTheDocument();
  });

  test("Executes onKeyUp event handler function when keyUp event is triggered", () => {
    const mockFunction = jest.fn();

    const handleKeyUp = () => mockFunction();

    render(<NameInput
      onType={() => {}}
      onKeyUp={handleKeyUp}
    />);

    const nameInput = screen.getByRole("textbox");

    fireEvent.keyUp(nameInput);

    expect(mockFunction).toBeCalled();
  });
});
