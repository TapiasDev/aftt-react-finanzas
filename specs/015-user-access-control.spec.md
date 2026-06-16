# Spec 015 - User Access Control

## Objective

Ensure only authenticated active users can access the planner.

## Inputs

| Field      | Type              | Required |
| ---------- | ----------------- | -------- |
| session    | AuthSession       | no       |
| userStatus | New / Active      | no       |

## Outputs

| Field          | Type    |
| -------------- | ------- |
| canAccessApp   | boolean |
| canAccessPlanner | boolean |

## Business Rules

- Users without session cannot access the planner.
- Users with status `New` cannot access the planner.
- Users with status `New` must be redirected to the password change flow.
- Users with status `Active` can access the planner.

## Acceptance Criteria

### AC-001

Given a user without session
When the application is opened
Then the system shows the login screen.

### AC-002

Given a user with status `New`
When the application is opened after login
Then the system shows the forced password change screen.

### AC-003

Given a user with status `Active`
When the application is opened after login
Then the system shows the planner.
