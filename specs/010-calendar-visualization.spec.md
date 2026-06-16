# Spec 010 - Calendar Visualization

## Objective

Display registered expenses in a real monthly calendar.

## Inputs

| Field | Type    | Required |
| ----- | ------- | -------- |
| year  | integer | yes      |
| month | integer | yes      |

## Outputs

| Field        | Type          |
| ------------ | ------------- |
| calendarDays | CalendarDay[] |
| expenses     | Expense[]     |

## Business Rules

- Calendar must show real days of the month.
- Expenses must appear on their estimated payment date.
- Calendar must visually separate first and second fortnight.
- Calendar must show paid and pending states.

## Acceptance Criteria

### AC-001

Given June 2026
When the calendar is displayed
Then it shows 30 days.

### AC-002

Given an expense registered for June 15
When the calendar is displayed
Then the expense appears on June 15.
