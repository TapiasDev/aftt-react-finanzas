# Spec 013 - User Authentication

## Objective

Allow a user to authenticate with email and password before accessing the planner.

## Inputs

| Field    | Type   | Required |
| -------- | ------ | -------- |
| email    | string | yes      |
| password | string | yes      |

## Outputs

| Field   | Type        |
| ------- | ----------- |
| session | AuthSession |
| user    | User        |

## Business Rules

- Authentication uses `email` and password.
- Only existing users can authenticate.
- Invalid credentials must be rejected.
- User state must be returned after authentication.

## Acceptance Criteria

### AC-001

Given a valid email and password
When the user signs in
Then the system creates an authenticated session.

### AC-002

Given invalid credentials
When the user signs in
Then the system rejects the operation.
