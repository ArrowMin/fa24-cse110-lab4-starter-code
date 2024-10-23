import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("adds a new expense and updates total and remaining", () => {
  render(<App />);
  const nameInput = screen.getByLabelText("Name");
  const costInput = screen.getByLabelText("Cost");
  const addButton = screen.getByText("Save");

  fireEvent.change(nameInput, { target: { value: "Test Expense" } });
  fireEvent.change(costInput, { target: { value: "100" } });
  fireEvent.click(addButton);

  expect(screen.getByText("Test Expense")).toBeInTheDocument();
  expect(screen.getByText("$100")).toBeInTheDocument();
  expect(screen.getByText("Remaining: $900")).toBeInTheDocument();
  expect(screen.getByText("Spent so far: $100")).toBeInTheDocument();
});

test("deletes an expense and updates total and remaining budget", () => {
  render(<App />);

  const nameInput = screen.getByLabelText("Name");
  const costInput = screen.getByLabelText("Cost");
  const addButton = screen.getByText("Save");

  fireEvent.change(nameInput, { target: { value: "Test Expense" } });
  fireEvent.change(costInput, { target: { value: "100" } });
  fireEvent.click(addButton);

  expect(screen.getByText("Test Expense")).toBeInTheDocument();
  expect(screen.getByText("$100")).toBeInTheDocument();
  expect(screen.getByText("Remaining: $900")).toBeInTheDocument();
  expect(screen.getByText("Spent so far: $100")).toBeInTheDocument();

  const deleteButton = screen.getByText("x");
  fireEvent.click(deleteButton);

  expect(screen.queryByText("Test Expense")).not.toBeInTheDocument();
  expect(screen.queryByText("$100")).not.toBeInTheDocument();
  expect(screen.getByText("Remaining: $1000")).toBeInTheDocument();
  expect(screen.getByText("Spent so far: $0")).toBeInTheDocument();
});

test("validates that budget equals remaining balance plus total expenditure", () => {
  render(<App />);
  const nameInput = screen.getByLabelText("Name");
  const costInput = screen.getByLabelText("Cost");
  const addButton = screen.getByText("Save");

  fireEvent.change(nameInput, { target: { value: "Test Expense" } });
  fireEvent.change(costInput, { target: { value: "123" } });
  fireEvent.click(addButton);

  const budgetText = screen.getByTestId("budget").textContent;
  const remainingText = screen.getByTestId("remaining-budget").textContent;
  const spentText = screen.getByTestId("total-spent").textContent;

  const budget = parseInt(budgetText!);
  const remaining = parseInt(remainingText!);
  const spent = parseInt(spentText!);

  expect(remaining + spent).toBe(budget);
});
