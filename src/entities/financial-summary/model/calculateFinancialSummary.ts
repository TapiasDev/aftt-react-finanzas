import type { Expense, FinancialSummary } from '../../../shared/types/planner'

export function calculateFinancialSummary(
  incomeAmount: number,
  expenses: Expense[],
): FinancialSummary {
  const totalToPay = expenses.reduce((total, expense) => total + expense.amount, 0)
  const totalPaid = expenses
    .filter((expense) => expense.status === 'Paid')
    .reduce((total, expense) => total + expense.amount, 0)

  return {
    totalIncome: incomeAmount,
    totalToPay,
    totalPaid,
    totalRemainingToPay: totalToPay - totalPaid,
    remainingIfEverythingIsPaid: incomeAmount - totalToPay,
    currentAvailable: incomeAmount - totalPaid,
  }
}
