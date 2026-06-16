# Spec 003 - Fortnight Selection

## Objective

Allow the user to select the first or second fortnight of a month.

## Inputs

| Field         | Type           | Required |
| ------------- | -------------- | -------- |
| monthPeriodId | uuid           | yes      |
| fortnightType | First / Second | yes      |

## Outputs

| Field             | Type            |
| ----------------- | --------------- |
| selectedFortnight | FortnightPeriod |
| expenses          | Expense[]       |

## Business Rules

- First fortnight goes from day 1 to day 15.
- Second fortnight goes from day 16 to the last day of the month.

## Acceptance Criteria

### AC-001

Given a selected month
When the user selects first fortnight
Then the system displays expenses from day 1 to day 15.

### AC-002

Given a selected month
When the user selects second fortnight
Then the system displays expenses from day 16 to the last day.
