# Spec 001 - Year Selection

## Objective

Allow the user to select the year where expenses will be managed.

## Inputs

| Field | Type    | Required |
| ----- | ------- | -------- |
| year  | integer | yes      |

## Outputs

| Field        | Type          |
| ------------ | ------------- |
| selectedYear | integer       |
| months       | MonthPeriod[] |

## Business Rules

- The year must be valid.
- The year must contain 12 months.
- Changing the selected year must not delete previous information.

## Acceptance Criteria

### AC-001

Given a valid year
When the user selects the year
Then the system loads the 12 months of that year.

### AC-002

Given a year with existing records
When the user selects that year
Then the system displays the saved information.
