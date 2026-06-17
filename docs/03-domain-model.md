# Domain Model

## Entities

## User

```txt
id
username
status: New | Active
passwordHash
createdAt
updatedAt
```

## YearPeriod

```txt
id
userId
year
createdAt
updatedAt
```

## MonthPeriod

```txt
id
yearPeriodId
monthNumber
monthName
createdAt
updatedAt
```

## FortnightPeriod

```txt
id
monthPeriodId
type: First | Second
startDate
endDate
incomeAmount
createdAt
updatedAt
```

## Expense

```txt
id
fortnightPeriodId
name
description
amount
estimatedPaymentDate
status: Pending | Paid
paidAt
createdAt
updatedAt
```
