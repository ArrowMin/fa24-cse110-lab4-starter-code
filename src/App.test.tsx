import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
window.alert = jest.fn();

//Tests for the initial starting values of budget, remaining, and spent dollars
describe ("Inital", () =>{
  test("initial values", () => {
    render(<App />);
    const budget = screen.getByText("Budget: $1000");
    const remaining = screen.getByText("Remaining: $1000");
    const spent = screen.getByText("Spent so far: $0");

    expect(budget).toBeInTheDocument();
    expect(remaining).toBeInTheDocument();
    expect(spent).toBeInTheDocument();
    expect(spent).not.toBeInTheDocument();
  });
});

//These are tests for creating an expense
describe ("Create an Expense", () =>{

  //Tests for the correct update of the spent and remaining dollars when adding a new expense
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

  //Tests for the correct update of the spent and remaining dollars when adding a new expense ($0)
    test("adds a new expense, $0", () => {
    render(<App />);
    const nameInput = screen.getByLabelText("Name");
    const costInput = screen.getByLabelText("Cost");
    const addButton = screen.getByText("Save");

    fireEvent.change(nameInput, { target: { value: "Test Expense" } });
    fireEvent.change(costInput, { target: { value: "0" } });
    fireEvent.click(addButton);

    expect(screen.getByText("Test Expense")).toBeInTheDocument();
    expect(screen.getByText("$0")).toBeInTheDocument();
    expect(screen.getByText("Remaining: $1000")).toBeInTheDocument();
    expect(screen.getByText("Spent so far: $0")).toBeInTheDocument();
    });

    //Tests for the correct update of the spent and remaining dollars when adding a new expense ($1000 (max))
    test("adds a new expense, $1000", () => {
    render(<App />);
    const nameInput = screen.getByLabelText("Name");
    const costInput = screen.getByLabelText("Cost");
    const addButton = screen.getByText("Save");

    fireEvent.change(nameInput, { target: { value: "Test Expense" } });
    fireEvent.change(costInput, { target: { value: "1000" } });
    fireEvent.click(addButton);

    expect(screen.getByText("Test Expense")).toBeInTheDocument();
    expect(screen.getByText("$1000")).toBeInTheDocument();
    expect(screen.getByText("Remaining: $0")).toBeInTheDocument();
    expect(screen.getByText("Spent so far: $1000")).toBeInTheDocument();
    });
});

//These are tests for deleting an expense
describe ("Delete an Expense", () =>{

   //Tests for the correct update of the spent and remaining dollars when deleting an expense
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

  //Tests for the correct update of the spent and remaining dollars when deleting an expense ($0)
  test("deletes a new expense, $0", () => {
    render(<App />);
    const nameInput = screen.getByLabelText("Name");
    const costInput = screen.getByLabelText("Cost");
    const addButton = screen.getByText("Save");

    fireEvent.change(nameInput, { target: { value: "Test Expense" } });
    fireEvent.change(costInput, { target: { value: "0" } });
    fireEvent.click(addButton);

    expect(screen.getByText("Test Expense")).toBeInTheDocument();
    expect(screen.getByText("$0")).toBeInTheDocument();
    expect(screen.getByText("Remaining: $1000")).toBeInTheDocument();
    expect(screen.getByText("Spent so far: $0")).toBeInTheDocument();

    const deleteButton = screen.getByText("x");
    fireEvent.click(deleteButton);
    expect(screen.queryByText("Test Expense")).not.toBeInTheDocument();
    expect(screen.queryByText("$0")).not.toBeInTheDocument();
    expect(screen.getByText("Remaining: $1000")).toBeInTheDocument();
    expect(screen.getByText("Spent so far: $0")).toBeInTheDocument();
    });
});

//These are tests for checking that the budget=remaining+spent is accurate
describe ("Budget Balance Verficiation", () =>{

  //Tests if budget=remaining+spent
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
});

//These tests are for when it goes over budget
describe ("Over Budget", () =>{

  //Tests that the alert works when you go over budget
  test("when you exceed your budget", () => {
    render(<App />);
    const nameInput = screen.getByLabelText("Name");
    const costInput = screen.getByLabelText("Cost");
    const addButton = screen.getByText("Save");

    fireEvent.change(nameInput, { target: { value: "Test Expense" } });
    fireEvent.change(costInput, { target: { value: "1001" } });
    fireEvent.click(addButton);

    const budgetText = screen.getByTestId("budget").textContent;
    const remainingText = screen.getByTestId("remaining-budget").textContent;
    const spentText = screen.getByTestId("total-spent").textContent;

    const budget = parseInt(budgetText!);
    const remaining = parseInt(remainingText!);
    const spent = parseInt(spentText!);

    expect(window.alert).toHaveBeenCalledWith('You have exceeded your budget!');
    expect(remaining + spent).toBe(budget);
  });

   //Tests that when you exceed your budget that when you delete it, the remaining comes back
   test("when you exceed your budget and then delete it", () => {
    render(<App />);
    const nameInput = screen.getByLabelText("Name");
    const costInput = screen.getByLabelText("Cost");
    const addButton = screen.getByText("Save");

    fireEvent.change(nameInput, { target: { value: "Test Expense" } });
    fireEvent.change(costInput, { target: { value: "1001" } });
    fireEvent.click(addButton);

    const budgetText = screen.getByTestId("budget").textContent;
    const remainingText = screen.getByTestId("remaining-budget").textContent;
    const spentText = screen.getByTestId("total-spent").textContent;

    const budget = parseInt(budgetText!);
    const remaining = parseInt(remainingText!);
    const spent = parseInt(spentText!);

    const deleteButton = screen.getByText("x");
    fireEvent.click(deleteButton);
    expect(remaining).toBe(budget);
  });
});

