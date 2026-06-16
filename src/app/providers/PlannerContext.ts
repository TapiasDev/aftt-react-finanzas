import { createContext } from 'react'
import type {
  Expense,
  FinancialSummary,
  FortnightPeriod,
  FortnightType,
  MonthDetail,
  MonthSummary,
} from '../../shared/types/planner'

export interface PlannerContextValue {
  availableYears: number[]
  selectedYear: number | null
  months: MonthSummary[]
  selectedMonth: MonthDetail | null
  selectedFortnightType: FortnightType
  selectedFortnight: FortnightPeriod | null
  selectedFortnightExpenses: Expense[]
  financialSummary: FinancialSummary
  isLoading: boolean
  isSavingIncome: boolean
  isSavingExpense: boolean
  isTogglingExpense: boolean
  isClosingMonth: boolean
  error: string | null
  selectYear: (year: number) => Promise<void>
  selectMonth: (monthNumber: number) => Promise<void>
  selectFortnight: (fortnightType: FortnightType) => void
  saveFortnightIncome: (incomeAmount: number) => Promise<void>
  createExpense: (input: {
    fortnightPeriodId: string
    name: string
    amount: number
    estimatedPaymentDate: string
    description: string
  }) => Promise<void>
  toggleExpenseStatus: (expenseId: string, isPaid: boolean) => Promise<void>
  updateExpense: (input: {
    expenseId: string
    name: string
    amount: number
    estimatedPaymentDate: string
    description: string
  }) => Promise<void>
  closeMonth: (monthPeriodId: string, confirmClose: boolean) => Promise<void>
}

export const PlannerContext = createContext<PlannerContextValue | null>(null)
