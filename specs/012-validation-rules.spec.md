# Spec 012 - Validation Rules

## Objective

Centralize validation rules for year, month, fortnight, income and expenses.

## Inputs

| Field  | Type    |
| ------ | ------- |
| year   | integer |
| month  | integer |
| amount | decimal |
| date   | date    |
| name   | string  |

## Outputs

| Field   | Type              |
| ------- | ----------------- |
| isValid | boolean           |
| errors  | ValidationError[] |

## Business Rules

- Year is required.
- Month is required.
- Month must be between 1 and 12.
- Amount must be greater than zero for expenses.
- Income must be greater than or equal to zero.
- Expense name is required.
- Expense date must belong to selected month.
- Expense date must belong to selected fortnight.

## Acceptance Criteria

### AC-001

Given an expense amount of 0
When validation runs
Then the system returns a validation error.

### AC-002

Given an empty expense name
When validation runs
Then the system returns a validation error.

### AC-003

Given a date outside the selected month
When validation runs
Then the system returns a validation error.
