import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import Signin from "./Signin";
import "@testing-library/jest-dom";
import { act } from "react-dom/test-utils";

jest.mock("axios");

describe("Signin Component", () => {
  test("renders the Signin component correctly", () => {
    render(
      <BrowserRouter>
        <Signin />
      </BrowserRouter>
    );

    expect(screen.getByText("Welcome to Campusify")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email Address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  test("validates email input correctly", () => {
    render(
      <BrowserRouter>
        <Signin />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText("Email Address");
    fireEvent.change(emailInput, { target: { value: "invalidEmail" } });

    expect(screen.getByText("Invalid email address!")).toBeInTheDocument();
  });

  test("validates password input correctly", () => {
    render(
      <BrowserRouter>
        <Signin />
      </BrowserRouter>
    );

    const passwordInput = screen.getByPlaceholderText("Password");
    fireEvent.change(passwordInput, { target: { value: "short" } });

    expect(
      screen.getByText("Password must be more than 8 characters and contain only letters and digits.")
    ).toBeInTheDocument();
  });

  test("toggles password visibility", () => {
    render(
      <BrowserRouter>
        <Signin />
      </BrowserRouter>
    );

    const toggleIcon = screen.getByRole("button", { name: /toggle password/i });
    const passwordInput = screen.getByPlaceholderText("Password");

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(toggleIcon);
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(toggleIcon);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("submits login form successfully", async () => {
    axios.post.mockResolvedValue({
      data: { user: "Test User" },
    });

    render(
      <BrowserRouter>
        <Signin />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText("Email Address");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByText("Submit");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123" } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(localStorage.getItem("userData")).toContain("Test User");
  });
});
