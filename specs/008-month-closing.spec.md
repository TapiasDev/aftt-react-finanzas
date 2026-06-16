# Spec 008 - Month Closing

## Objective

Allow the user to close a month manually.

## Inputs

| Field         | Type    | Required |
| ------------- | ------- | -------- |
| monthPeriodId | uuid    | yes      |
| confirmClose  | boolean | yes      |

## Outputs

| Field       | Type     |
| ----------- | -------- |
| monthStatus | Closed   |
| closedAt    | datetime |

## Business Rules

- Only open months can be closed.
- Closing a month requires user confirmation.
- Closed months become read-only.
- Closing a month does not require all expenses to be paid.

## Acceptance Criteria

### AC-001

Given an open month
When the user confirms month closing
Then the month status becomes Closed.

### AC-002

Given a closed month
When the user tries to create, edit or delete expenses
Then the system rejects the operation.
