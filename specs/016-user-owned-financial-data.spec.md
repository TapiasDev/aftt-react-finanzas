# Spec 016 - User Owned Financial Data

## Objective

Ensure every financial record belongs to the authenticated user and is isolated from other users.

## Inputs

| Field  | Type | Required |
| ------ | ---- | -------- |
| userId | uuid | yes      |

## Outputs

| Field        | Type          |
| ------------ | ------------- |
| years        | YearPeriod[]  |
| months       | MonthPeriod[] |
| expenses     | Expense[]     |

## Business Rules

- Financial data must belong to one user.
- The system must only return records for the authenticated user.
- One user cannot read or modify another user's financial data.

## Acceptance Criteria

### AC-001

Given two different users with their own data
When one user opens the planner
Then the system only returns that user's years, months and expenses.

### AC-002

Given a user trying to access another user's data
When the operation is evaluated
Then the system rejects the operation.
