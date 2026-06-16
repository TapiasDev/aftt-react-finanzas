# Spec 009 - Financial Summary

## Objective

Calculate the financial summary for a selected fortnight.

## Inputs

| Field        | Type      |
| ------------ | --------- |
| incomeAmount | decimal   |
| expenses     | Expense[] |

## Outputs

| Field                       | Type    |
| --------------------------- | ------- |
| totalIncome                 | decimal |
| totalToPay                  | decimal |
| totalPaid                   | decimal |
| totalRemainingToPay         | decimal |
| remainingIfEverythingIsPaid | decimal |
| currentAvailable            | decimal |

## Business Rules

```txt
totalToPay = sum(expenses.amount)

totalPaid = sum(expenses.amount where status = Paid)

totalRemainingToPay = totalToPay - totalPaid

remainingIfEverythingIsPaid = totalIncome - totalToPay

currentAvailable = totalIncome - totalPaid
```

## Acceptance Criteria

### AC-001

Given income of 1,000,000
And total expenses of 700,000
When the summary is calculated
Then remainingIfEverythingIsPaid must be 300,000.

### AC-002

Given total expenses of 700,000
And paid expenses of 300,000
When the summary is calculated
Then totalRemainingToPay must be 400,000.
