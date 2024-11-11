import { Database } from "sqlite";
import { Expense } from "../types";
import { Request, Response } from "express";

export async function createExpenseServer(
  req: Request,
  res: Response,
  db: Database
) {
  const { id, cost, description } = req.body;

  if (!description || !id || !cost) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  try {
    await db.run(
      "INSERT INTO expenses (id, description, cost) VALUES (?, ?, ?);",
      [id, description, cost]
    );
  } catch (error) {
    return res
      .status(400)
      .send({ error: `Expense could not be created, + ${error}` });
  }

  res.status(201).send({ id, description, cost });
}

export function deleteExpense(
  req: Request,
  res: Response,
  expenses: Expense[]
) {
  // TO DO: Implement deleteExpense function
  const expenseId = req.params.id;
  const index = expenses.findIndex((expense) => expense.id === expenseId);

  if (index !== -1) {
    expenses.splice(index, 1);
    res.status(200).send({ data: expenses });
  } else {
    res.status(404).send({ error: "Expense not found" });
  }
}

export function getExpenses(req: Request, res: Response, expenses: Expense[]) {
  res.status(200).send({ data: expenses });
}
