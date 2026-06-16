# Spec 002 - Month Selection

## Objective

Allow the user to select a month inside the selected year.

## Inputs

| Field | Type    | Required |
| ----- | ------- | -------- |
| year  | integer | yes      |
| month | integer | yes      |

## Outputs

| Field         | Type              |
| ------------- | ----------------- |
| selectedMonth | MonthPeriod       |
| fortnights    | FortnightPeriod[] |

## Business Rules

- The month must belong to the selected year.
- The month must have real calendar days.
- The month must contain two fortnights.

## Acceptance Criteria

### AC-001

Given a selected year
When the user selects a month
Then the system displays the calendar for that month.

### AC-002

Given June 2026
When the month is loaded
Then the system must show 30 days.
