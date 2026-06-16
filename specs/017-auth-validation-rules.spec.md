# Spec 017 - Auth Validation Rules

## Objective

Centralize validation rules for authentication and first password change.

## Inputs

| Field           | Type   |
| --------------- | ------ |
| email           | string |
| password        | string |
| newPassword     | string |
| confirmPassword | string |

## Outputs

| Field   | Type              |
| ------- | ----------------- |
| isValid | boolean           |
| errors  | ValidationError[] |

## Business Rules

- Email is required.
- Password is required.
- New password is required.
- New password must contain at least 8 characters.
- Password confirmation is required.
- Password confirmation must match the new password.

## Acceptance Criteria

### AC-001

Given an empty email
When authentication validation runs
Then the system returns a validation error.

### AC-002

Given an empty password
When authentication validation runs
Then the system returns a validation error.

### AC-003

Given a new password and a different confirmation
When password change validation runs
Then the system returns a validation error.
