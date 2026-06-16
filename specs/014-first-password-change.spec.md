# Spec 014 - First Password Change

## Objective

Force a new user to change the temporary password before using the planner.

## Inputs

| Field           | Type   | Required |
| --------------- | ------ | -------- |
| userId          | uuid   | yes      |
| newPassword     | string | yes      |
| confirmPassword | string | yes      |

## Outputs

| Field      | Type   |
| ---------- | ------ |
| userStatus | Active |
| session    | AuthSession |

## Business Rules

- Only users with status `New` can perform this flow.
- New password and confirmation are required.
- Confirmation must match the new password.
- Successful completion changes the user state from `New` to `Active`.

## Acceptance Criteria

### AC-001

Given a user with status `New`
When the user saves a valid new password
Then the system changes the user status to `Active`.

### AC-002

Given a user with status `New`
When the password confirmation does not match
Then the system rejects the operation.
