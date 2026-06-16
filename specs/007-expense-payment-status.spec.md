# Spec 007 - Expense Payment Status

## Objective

Allow the user to mark an expense as paid or pending using a checkbox.

## Inputs

| Field     | Type    | Required |
| --------- | ------- | -------- |
| expenseId | uuid    | yes      |
| isPaid    | boolean | yes      |

## Outputs

| Field            | Type              |
| ---------------- | ----------------- |
| expenseStatus    | Pending / Paid    |
| paidAt           | datetime nullable |
| financialSummary | FinancialSummary  |

## Business Rules

- If isPaid is true, expense status becomes Paid.
- If isPaid is false, expense status becomes Pending.
- Paid expenses must have paidAt.
- Pending expenses must not have paidAt.
- Payment status cannot be changed if the month is closed.

## Acceptance Criteria

### AC-001

Given a pending expense
When the user checks the paid checkbox
Then the expense becomes Paid.

### AC-002

Given a paid expense
When the user unchecks the paid checkbox
Then the expense becomes Pending.

### AC-003

Given a payment status change
When the operation is completed
Then the financial summary is recalculated.
