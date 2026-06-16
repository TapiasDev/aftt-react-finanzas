export type MonthStatus = 'Open' | 'Closed'
export type ExpenseStatus = 'Pending' | 'Paid'
export type FortnightType = 'First' | 'Second'

export interface MonthSummary {
  id: string
  year: number
  monthNumber: number
  monthName: string
  status: MonthStatus
  closedAt: string | null
}

export interface FortnightPeriod {
  id: string
  monthPeriodId: string
  type: FortnightType
  startDate: string
  endDate: string
  incomeAmount: number
}

export interface Expense {
  id: string
  fortnightPeriodId: string
  name: string
  description: string
  amount: number
  estimatedPaymentDate: string
  status: ExpenseStatus
  paidAt: string | null
}

export interface MonthDetail extends MonthSummary {
  fortnights: FortnightPeriod[]
  expenses: Expense[]
}

export interface YearData {
  selectedYear: number
  months: MonthSummary[]
}

export interface FinancialSummary {
  totalIncome: number
  totalToPay: number
  totalPaid: number
  totalRemainingToPay: number
  remainingIfEverythingIsPaid: number
  currentAvailable: number
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface SaveFortnightIncomeInput {
  fortnightPeriodId: string
  incomeAmount: number
}

export interface CreateExpenseInput {
  fortnightPeriodId: string
  name: string
  amount: number
  estimatedPaymentDate: string
  description: string
}

export interface ToggleExpenseStatusInput {
  expenseId: string
  isPaid: boolean
}

export interface UpdateExpenseInput {
  expenseId: string
  name: string
  amount: number
  estimatedPaymentDate: string
  description: string
}

export interface CloseMonthInput {
  monthPeriodId: string
  confirmClose: boolean
}

export interface CalendarCell {
  date: string
  dayNumber: number
  isCurrentMonth: boolean
  fortnightType: FortnightType
}
