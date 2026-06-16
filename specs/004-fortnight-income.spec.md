# Spec 004 - Fortnight Income

## Objective

Allow the user to register or update the income for a specific fortnight.

## Inputs

| Field             | Type    | Required |
| ----------------- | ------- | -------- |
| fortnightPeriodId | uuid    | yes      |
| incomeAmount      | decimal | yes      |

## Outputs

| Field            | Type             |
| ---------------- | ---------------- |
| fortnightIncome  | decimal          |
| financialSummary | FinancialSummary |

## Business Rules

- Income must be greater than or equal to zero.
- Income belongs to one specific fortnight.
- Income cannot be updated if the month is closed.

## Acceptance Criteria

### AC-001

Given an open month
When the user enters an income amount
Then the system saves it for the selected fortnight.

### AC-002

Given a closed month
When the user tries to update income
Then the system rejects the operation.
