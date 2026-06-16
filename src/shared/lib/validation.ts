import type { AuthValidationResult } from '../types/auth'
import type { ValidationResult } from '../types/planner'

export function validateIncomeAmount(incomeAmount: number): ValidationResult {
  const errors: string[] = []

  if (Number.isNaN(incomeAmount)) {
    errors.push('Income amount is required.')
  }

  if (incomeAmount < 0) {
    errors.push('Income amount must be greater than or equal to zero.')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

interface ExpenseValidationInput {
  name: string
  amount: number
  estimatedPaymentDate: string
  month: number
  year: number
  fortnightStartDay: number
  fortnightEndDay: number
}

export function validateExpenseInput(input: ExpenseValidationInput): ValidationResult {
  const errors: string[] = []

  if (!input.name.trim()) {
    errors.push('Expense name is required.')
  }

  if (Number.isNaN(input.amount) || input.amount <= 0) {
    errors.push('Expense amount must be greater than zero.')
  }

  if (!input.estimatedPaymentDate) {
    errors.push('Estimated payment date is required.')
  } else {
    const [year, month, day] = input.estimatedPaymentDate.split('-').map(Number)

    if (year !== input.year || month !== input.month) {
      errors.push('Expense date must belong to the selected month.')
    }

    if (day < input.fortnightStartDay || day > input.fortnightEndDay) {
      errors.push('Expense date must belong to the selected fortnight.')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateSignInInput(username: string, password: string): AuthValidationResult {
  const errors: string[] = []

  if (!username.trim()) {
    errors.push('Username is required.')
  }

  if (!password.trim()) {
    errors.push('Password is required.')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateInitialPasswordChange(
  newPassword: string,
  confirmPassword: string,
): AuthValidationResult {
  const errors: string[] = []

  if (!newPassword.trim()) {
    errors.push('New password is required.')
  }

  if (newPassword.trim().length < 8) {
    errors.push('New password must contain at least 8 characters.')
  }

  if (!confirmPassword.trim()) {
    errors.push('Password confirmation is required.')
  }

  if (newPassword !== confirmPassword) {
    errors.push('Password confirmation must match the new password.')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
