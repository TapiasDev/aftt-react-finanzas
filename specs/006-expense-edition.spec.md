# Spec 006 - Expense Edition

## Objective

Allow the user to edit an existing expense when the month is open.

## Inputs

| Field                | Type    | Required |
| -------------------- | ------- | -------- |
| expenseId            | uuid    | yes      |
| name                 | string  | yes      |
| amount               | decimal | yes      |
| estimatedPaymentDate | date    | yes      |
| description          | string  | no       |

## Outputs

| Field            | Type             |
| ---------------- | ---------------- |
| updatedExpense   | Expense          |
| financialSummary | FinancialSummary |

## Business Rules

- Expense can only be edited if the month is open.
- New amount must be greater than zero.
- New date must match the selected fortnight.
- Updating an expense must recalculate financial summary.

## Acceptance Criteria

### AC-001

Given an open month
When the user updates an expense
Then the system saves the changes.

### AC-002

Given a closed month
When the user tries to update an expense
Then the system rejects the operation.
