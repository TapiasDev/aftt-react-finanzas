# Spec 005 - Expense Registration

## Objective

Allow the user to register expenses for a selected fortnight.

## Inputs

| Field                | Type    | Required |
| -------------------- | ------- | -------- |
| fortnightPeriodId    | uuid    | yes      |
| name                 | string  | yes      |
| amount               | decimal | yes      |
| estimatedPaymentDate | date    | yes      |
| description          | string  | no       |

## Outputs

| Field     | Type    |
| --------- | ------- |
| expenseId | uuid    |
| status    | Pending |

## Business Rules

- Name is required.
- Amount must be greater than zero.
- Estimated payment date must belong to the selected month.
- Estimated payment date must belong to the selected fortnight.
- Expense cannot be created if the month is closed.
- New expenses start with Pending status.

## Acceptance Criteria

### AC-001

Given an open month
When the user registers a valid expense
Then the system creates the expense as Pending.

### AC-002

Given first fortnight
When the user registers an expense with day 16 or greater
Then the system rejects the expense.

### AC-003

Given second fortnight
When the user registers an expense with day 15 or lower
Then the system rejects the expense.
