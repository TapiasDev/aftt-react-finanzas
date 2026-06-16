# Spec 013 - User Authentication

## Objective

Allow a user to authenticate with username and password before accessing the planner.

## Inputs

| Field    | Type   | Required |
| -------- | ------ | -------- |
| username | string | yes      |
| password | string | yes      |

## Outputs

| Field   | Type        |
| ------- | ----------- |
| session | AuthSession |
| user    | User        |

## Business Rules

- Authentication uses `username` and password.
- Only existing users can authenticate.
- Invalid credentials must be rejected.
- User state must be returned after authentication.

## Acceptance Criteria

### AC-001

Given a valid username and password
When the user signs in
Then the system creates an authenticated session.

### AC-002

Given invalid credentials
When the user signs in
Then the system rejects the operation.
