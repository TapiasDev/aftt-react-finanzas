# Spec 011 - Month Readonly Mode

## Objective

Ensure closed months are displayed in readonly mode.

## Inputs

| Field         | Type | Required |
| ------------- | ---- | -------- |
| monthPeriodId | uuid | yes      |

## Outputs

| Field    | Type    |
| -------- | ------- |
| readonly | boolean |

## Business Rules

- Closed months must be readonly.
- Open months must allow changes.
- Readonly mode hides or disables edit actions.

## Acceptance Criteria

### AC-001

Given a closed month
When the user opens it
Then create, edit and delete actions are disabled.

### AC-002

Given an open month
When the user opens it
Then create, edit and delete actions are enabled.
