import React from "react";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";

import Button from "../components/common/Button";

describe("Common Button Component Test", () => {
  afterEach(cleanup);

  test("Render button element", () => {
    render(<Button
      buttonName="buttonName"
      onClick={() => {}}
      className="buttonName"
    />);

    const button = screen.getByRole("button");

    expect(button).toBeInTheDocument();
    expect(button).toHaveAccessibleName("buttonName");
    expect(button).toHaveTextContent(/^buttonName$/);
    expect(button).toHaveStyle({
      position: "relative",
      height: "50px",
      padding: "0px 30px",
      border: "none",
      borderRadius: "10px",
      backgroundColor: "#000000",
      color: "#ffffff",
      fontSize: "20px",
      boxShadow: "5px 5px 5px #bfbfbf",
    });
  });

  test("Executes onClick event handler function when clicked", () => {
    const mockFunction = jest.fn();

    const handleButtonClick = () => mockFunction();

    render(<Button
      buttonName="buttonName"
      onClick={handleButtonClick}
      className="buttonName"
    />);

    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(mockFunction).toBeCalled();
  });
});
