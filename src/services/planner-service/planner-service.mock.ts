import { getDaysInMonth, getMonthName, toIsoDate } from '../../shared/lib/date'
import { validateExpenseInput } from '../../shared/lib/validation'
import { readStoredAuthSession } from '../auth-service/auth-session.storage'
import type {
  CloseMonthInput,
  CreateExpenseInput,
  Expense,
  MonthDetail,
  MonthStatus,
  MonthSummary,
  ToggleExpenseStatusInput,
  UpdateExpenseInput,
  YearData,
} from '../../shared/types/planner'
import type { PlannerService } from './planner-service'

interface YearRecord {
  selectedYear: number
  months: MonthDetail[]
}

const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

function createMonthDetail(
  year: number,
  monthNumber: number,
  options?: {
    status?: MonthStatus
    closedAt?: string | null
    firstIncome?: number
    secondIncome?: number
    expenses?: Expense[]
  },
): MonthDetail {
  const monthId = `month-${year}-${monthNumber}`
  const daysInMonth = getDaysInMonth(year, monthNumber)
  const status = options?.status ?? 'Open'

  return {
    id: monthId,
    year,
    monthNumber,
    monthName: getMonthName(year, monthNumber),
    status,
    closedAt: options?.closedAt ?? null,
    fortnights: [
      {
        id: `${monthId}-first`,
        monthPeriodId: monthId,
        type: 'First',
        startDate: toIsoDate(year, monthNumber, 1),
        endDate: toIsoDate(year, monthNumber, 15),
        incomeAmount: options?.firstIncome ?? 0,
      },
      {
        id: `${monthId}-second`,
        monthPeriodId: monthId,
        type: 'Second',
        startDate: toIsoDate(year, monthNumber, 16),
        endDate: toIsoDate(year, monthNumber, daysInMonth),
        incomeAmount: options?.secondIncome ?? 0,
      },
    ],
    expenses: options?.expenses ?? [],
  }
}

function createExpense(
  id: string,
  fortnightPeriodId: string,
  name: string,
  amount: number,
  estimatedPaymentDate: string,
  status: Expense['status'],
  description = '',
  paidAt: string | null = null,
): Expense {
  return {
    id,
    fortnightPeriodId,
    name,
    description,
    amount,
    estimatedPaymentDate,
    status,
    paidAt,
  }
}

function createUser001Data() {
  const june2026 = createMonthDetail(2026, 6, {
    firstIncome: 1200000,
    secondIncome: 1350000,
  })

  june2026.expenses = [
    createExpense(
      'expense-rent-user-001',
      june2026.fortnights[0].id,
      'Rent',
      450000,
      '2026-06-05',
      'Paid',
      'Apartment rent',
      '2026-06-05T08:00:00Z',
    ),
    createExpense(
      'expense-internet-user-001',
      june2026.fortnights[0].id,
      'Internet',
      90000,
      '2026-06-12',
      'Pending',
      'Home internet bill',
    ),
    createExpense(
      'expense-groceries-user-001',
      june2026.fortnights[1].id,
      'Groceries',
      180000,
      '2026-06-18',
      'Pending',
      'Supermarket',
    ),
    createExpense(
      'expense-gym-user-001',
      june2026.fortnights[1].id,
      'Gym',
      70000,
      '2026-06-24',
      'Paid',
      'Monthly membership',
      '2026-06-24T18:20:00Z',
    ),
    createExpense(
      'expense-streaming-user-001',
      june2026.fortnights[1].id,
      'Streaming',
      35000,
      '2026-06-28',
      'Pending',
      'Video subscription',
    ),
  ]

  const may2026 = createMonthDetail(2026, 5, {
    status: 'Closed',
    closedAt: '2026-05-31T23:59:59Z',
    firstIncome: 1150000,
    secondIncome: 1150000,
  })

  may2026.expenses = [
    createExpense(
      'expense-water-user-001',
      may2026.fortnights[0].id,
      'Water',
      55000,
      '2026-05-09',
      'Paid',
      'Water service',
      '2026-05-09T10:00:00Z',
    ),
    createExpense(
      'expense-electricity-user-001',
      may2026.fortnights[1].id,
      'Electricity',
      125000,
      '2026-05-20',
      'Paid',
      'Electric bill',
      '2026-05-20T14:00:00Z',
    ),
  ]

  return [createYearRecord(2025), createYearRecord(2026, [may2026, june2026])]
}

function createUser002Data() {
  const august2026 = createMonthDetail(2026, 8, {
    firstIncome: 2200000,
    secondIncome: 2100000,
  })

  august2026.expenses = [
    createExpense(
      'expense-office-user-002',
      august2026.fortnights[0].id,
      'Office rent',
      620000,
      '2026-08-03',
      'Pending',
      'Shared workspace',
    ),
    createExpense(
      'expense-travel-user-002',
      august2026.fortnights[0].id,
      'Travel',
      140000,
      '2026-08-10',
      'Paid',
      'Taxi and metro',
      '2026-08-10T09:20:00Z',
    ),
    createExpense(
      'expense-saas-user-002',
      august2026.fortnights[1].id,
      'SaaS tools',
      210000,
      '2026-08-19',
      'Pending',
      'Subscriptions',
    ),
  ]

  const january2026 = createMonthDetail(2026, 1, {
    firstIncome: 1950000,
    secondIncome: 1950000,
  })

  january2026.expenses = [
    createExpense(
      'expense-insurance-user-002',
      january2026.fortnights[0].id,
      'Insurance',
      180000,
      '2026-01-07',
      'Paid',
      'Health insurance',
      '2026-01-07T11:00:00Z',
    ),
  ]

  return [createYearRecord(2026, [january2026, august2026])]
}

function createYearRecord(selectedYear: number, presetMonths: MonthDetail[] = []): YearRecord {
  const months = Array.from({ length: 12 }, (_, index) => {
    const monthNumber = index + 1
    const presetMonth = presetMonths.find((month) => month.monthNumber === monthNumber)

    return presetMonth ?? createMonthDetail(selectedYear, monthNumber)
  })

  return {
    selectedYear,
    months,
  }
}

const plannerStore: Record<string, YearRecord[]> = {
  'user-001': createUser001Data(),
  'user-002': createUser002Data(),
}

function cloneMonthSummary(month: MonthDetail): MonthSummary {
  return {
    id: month.id,
    year: month.year,
    monthNumber: month.monthNumber,
    monthName: month.monthName,
    status: month.status,
    closedAt: month.closedAt,
  }
}

function cloneMonthDetail(month: MonthDetail): MonthDetail {
  return structuredClone(month)
}

function getAuthenticatedUserId() {
  const session = readStoredAuthSession()

  if (!session) {
    throw new Error('An authenticated user is required to access planner data.')
  }

  return session.user.id
}

function getAuthenticatedStore() {
  const userId = getAuthenticatedUserId()
  const userStore = plannerStore[userId]

  if (!userStore) {
    throw new Error(`Planner data was not found for user ${userId}.`)
  }

  return userStore
}

function findYearRecord(year: number) {
  const yearRecord = getAuthenticatedStore().find((record) => record.selectedYear === year)

  if (!yearRecord) {
    throw new Error(`Year ${year} is not available.`)
  }

  return yearRecord
}

function findMonthRecord(year: number, monthNumber: number) {
  const yearRecord = findYearRecord(year)
  const month = yearRecord.months.find((item) => item.monthNumber === monthNumber)

  if (!month) {
    throw new Error(`Month ${monthNumber} for year ${year} is not available.`)
  }

  return month
}

function findMonthByFortnightId(fortnightPeriodId: string) {
  for (const yearRecord of getAuthenticatedStore()) {
    for (const month of yearRecord.months) {
      const fortnight = month.fortnights.find((item) => item.id === fortnightPeriodId)

      if (fortnight) {
        return { month, fortnight }
      }
    }
  }

  throw new Error(`Fortnight ${fortnightPeriodId} was not found.`)
}

function findMonthByExpenseId(expenseId: string) {
  for (const yearRecord of getAuthenticatedStore()) {
    for (const month of yearRecord.months) {
      const expense = month.expenses.find((item) => item.id === expenseId)

      if (expense) {
        return { month, expense }
      }
    }
  }

  throw new Error(`Expense ${expenseId} was not found.`)
}

export const plannerServiceMock: PlannerService = {
  async getAvailableYears() {
    await delay(120)
    return getAuthenticatedStore().map((record) => record.selectedYear)
  },

  async getYear(year) {
    await delay(180)
    const yearRecord = findYearRecord(year)

    return {
      selectedYear: yearRecord.selectedYear,
      months: yearRecord.months.map(cloneMonthSummary),
    } satisfies YearData
  },

  async getMonth(year, month) {
    await delay(180)
    return cloneMonthDetail(findMonthRecord(year, month))
  },

  async saveFortnightIncome(input) {
    await delay(180)

    const { month, fortnight } = findMonthByFortnightId(input.fortnightPeriodId)

    if (month.status === 'Closed') {
      throw new Error('Income cannot be updated for a closed month.')
    }

    fortnight.incomeAmount = input.incomeAmount
    return structuredClone(fortnight)
  },

  async createExpense(input: CreateExpenseInput) {
    await delay(180)

    const { month, fortnight } = findMonthByFortnightId(input.fortnightPeriodId)

    if (month.status === 'Closed') {
      throw new Error('Expense cannot be created for a closed month.')
    }

    const validation = validateExpenseInput({
      name: input.name,
      amount: input.amount,
      estimatedPaymentDate: input.estimatedPaymentDate,
      month: month.monthNumber,
      year: month.year,
      fortnightStartDay: Number(fortnight.startDate.slice(-2)),
      fortnightEndDay: Number(fortnight.endDate.slice(-2)),
    })

    if (!validation.isValid) {
      throw new Error(validation.errors[0])
    }

    month.expenses.push({
      id: `expense-${crypto.randomUUID()}`,
      fortnightPeriodId: input.fortnightPeriodId,
      name: input.name.trim(),
      description: input.description.trim(),
      amount: input.amount,
      estimatedPaymentDate: input.estimatedPaymentDate,
      status: 'Pending',
      paidAt: null,
    })

    return cloneMonthDetail(month)
  },

  async toggleExpenseStatus(input: ToggleExpenseStatusInput) {
    await delay(180)

    const { month, expense } = findMonthByExpenseId(input.expenseId)

    if (month.status === 'Closed') {
      throw new Error('Payment status cannot be changed for a closed month.')
    }

    expense.status = input.isPaid ? 'Paid' : 'Pending'
    expense.paidAt = input.isPaid ? new Date().toISOString() : null

    return cloneMonthDetail(month)
  },

  async updateExpense(input: UpdateExpenseInput) {
    await delay(180)

    const { month, expense } = findMonthByExpenseId(input.expenseId)

    if (month.status === 'Closed') {
      throw new Error('Expense cannot be updated for a closed month.')
    }

    const fortnight = month.fortnights.find((item) => item.id === expense.fortnightPeriodId)

    if (!fortnight) {
      throw new Error(`Fortnight ${expense.fortnightPeriodId} was not found.`)
    }

    const validation = validateExpenseInput({
      name: input.name,
      amount: input.amount,
      estimatedPaymentDate: input.estimatedPaymentDate,
      month: month.monthNumber,
      year: month.year,
      fortnightStartDay: Number(fortnight.startDate.slice(-2)),
      fortnightEndDay: Number(fortnight.endDate.slice(-2)),
    })

    if (!validation.isValid) {
      throw new Error(validation.errors[0])
    }

    expense.name = input.name.trim()
    expense.amount = input.amount
    expense.estimatedPaymentDate = input.estimatedPaymentDate
    expense.description = input.description.trim()

    return cloneMonthDetail(month)
  },

  async closeMonth(input: CloseMonthInput) {
    await delay(180)

    if (!input.confirmClose) {
      throw new Error('Closing a month requires confirmation.')
    }

    for (const yearRecord of getAuthenticatedStore()) {
      for (const month of yearRecord.months) {
        if (month.id !== input.monthPeriodId) {
          continue
        }

        if (month.status === 'Closed') {
          throw new Error('Only open months can be closed.')
        }

        month.status = 'Closed'
        month.closedAt = new Date().toISOString()

        return cloneMonthDetail(month)
      }
    }

    throw new Error(`Month ${input.monthPeriodId} was not found.`)
  },
}
