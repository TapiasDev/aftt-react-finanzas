import {
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { calculateFinancialSummary } from '../../entities/financial-summary/model/calculateFinancialSummary'
import { validateIncomeAmount } from '../../shared/lib/validation'
import type {
  CloseMonthInput,
  CreateExpenseInput,
  DeleteExpenseInput,
  FinancialSummary,
  FortnightType,
  MonthDetail,
  MonthSummary,
  UpdateExpenseInput,
} from '../../shared/types/planner'
import { plannerService } from '../../services/planner-service'
import { PlannerContext, type PlannerContextValue } from './PlannerContext'

const emptySummary: FinancialSummary = {
  totalIncome: 0,
  totalToPay: 0,
  totalPaid: 0,
  totalRemainingToPay: 0,
  remainingIfEverythingIsPaid: 0,
  currentAvailable: 0,
}

export function PlannerProvider({ children }: PropsWithChildren) {
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonthNumber = today.getMonth() + 1
  const [availableYears, setAvailableYears] = useState<number[]>([])
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [months, setMonths] = useState<MonthSummary[]>([])
  const [selectedMonth, setSelectedMonth] = useState<MonthDetail | null>(null)
  const [selectedFortnightType, setSelectedFortnightType] = useState<FortnightType>('First')
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingIncome, setIsSavingIncome] = useState(false)
  const [isSavingExpense, setIsSavingExpense] = useState(false)
  const [isTogglingExpense, setIsTogglingExpense] = useState(false)
  const [isClosingMonth, setIsClosingMonth] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function initializePlanner() {
      try {
        setIsLoading(true)
        setError(null)

        const years = await plannerService.getAvailableYears()

        if (!isMounted) {
          return
        }

        setAvailableYears(years)

        const defaultYear = years.includes(currentYear) ? currentYear : (years.at(-1) ?? null)

        if (defaultYear !== null) {
          await loadYear(defaultYear)
        }
      } catch (caughtError) {
        if (isMounted) {
          setError(getErrorMessage(caughtError))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void initializePlanner()

    return () => {
      isMounted = false
    }
  }, [])

  const selectedFortnight = useMemo(() => {
    return (
      selectedMonth?.fortnights.find((fortnight) => fortnight.type === selectedFortnightType) ?? null
    )
  }, [selectedFortnightType, selectedMonth])

  const selectedFortnightExpenses = useMemo(() => {
    if (!selectedFortnight || !selectedMonth) {
      return []
    }

    return selectedMonth.expenses.filter(
      (expense) => expense.fortnightPeriodId === selectedFortnight.id,
    )
  }, [selectedFortnight, selectedMonth])

  const financialSummary = useMemo(() => {
    if (!selectedFortnight) {
      return emptySummary
    }

    return calculateFinancialSummary(selectedFortnight.incomeAmount, selectedFortnightExpenses)
  }, [selectedFortnight, selectedFortnightExpenses])

  async function loadYear(year: number, preferredMonthNumber?: number) {
    const yearData = await plannerService.getYear(year)
    setSelectedYear(yearData.selectedYear)
    setMonths(yearData.months)
    setAvailableYears((currentYears) => [...new Set([...currentYears, yearData.selectedYear])].sort((a, b) => a - b))

    const defaultMonthNumber =
      year === currentYear
        ? yearData.months.find((month) => month.monthNumber === currentMonthNumber)?.monthNumber
        : yearData.months[0]?.monthNumber

    const nextMonthNumber = preferredMonthNumber ?? defaultMonthNumber ?? yearData.months[0]?.monthNumber

    if (nextMonthNumber) {
      const monthDetail = await plannerService.getMonth(year, nextMonthNumber)
      setSelectedMonth(monthDetail)
      setSelectedFortnightType('First')
    } else {
      setSelectedMonth(null)
    }
  }

  function applyUpdatedMonth(updatedMonth: MonthDetail) {
    setSelectedMonth(updatedMonth)
    setMonths((currentMonths) =>
      currentMonths.map((month) =>
        month.id === updatedMonth.id
          ? {
              id: updatedMonth.id,
              year: updatedMonth.year,
              monthNumber: updatedMonth.monthNumber,
              monthName: updatedMonth.monthName,
              status: updatedMonth.status,
              closedAt: updatedMonth.closedAt,
            }
          : month,
      ),
    )
  }

  async function selectYear(year: number) {
    try {
      setIsLoading(true)
      setError(null)
      await loadYear(year, selectedMonth?.monthNumber)
    } catch (caughtError) {
      setError(getErrorMessage(caughtError))
    } finally {
      setIsLoading(false)
    }
  }

  async function selectMonth(monthNumber: number) {
    if (selectedYear === null) {
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const monthDetail = await plannerService.getMonth(selectedYear, monthNumber)
      setSelectedMonth(monthDetail)
      setSelectedFortnightType('First')
    } catch (caughtError) {
      setError(getErrorMessage(caughtError))
    } finally {
      setIsLoading(false)
    }
  }

  function selectFortnight(fortnightType: FortnightType) {
    setSelectedFortnightType(fortnightType)
  }

  async function saveFortnightIncome(incomeAmount: number) {
    if (!selectedMonth || !selectedFortnight || selectedYear === null) {
      return
    }

    const validation = validateIncomeAmount(incomeAmount)

    if (!validation.isValid) {
      throw new Error(validation.errors[0])
    }

    try {
      setIsSavingIncome(true)
      setError(null)

      const updatedFortnight = await plannerService.saveFortnightIncome({
        fortnightPeriodId: selectedFortnight.id,
        incomeAmount,
      })
      const refreshedMonth = await plannerService.getMonth(selectedYear, selectedMonth.monthNumber)

      applyUpdatedMonth({
        ...refreshedMonth,
        fortnights: refreshedMonth.fortnights.map((fortnight) =>
          fortnight.id === updatedFortnight.id ? updatedFortnight : fortnight,
        ),
      })
    } catch (caughtError) {
      const message = getErrorMessage(caughtError)
      setError(message)
      throw new Error(message, { cause: caughtError })
    } finally {
      setIsSavingIncome(false)
    }
  }

  async function createExpense(input: CreateExpenseInput) {
    try {
      setIsSavingExpense(true)
      setError(null)

      const updatedMonth = await plannerService.createExpense(input)
      applyUpdatedMonth(updatedMonth)
    } catch (caughtError) {
      const message = getErrorMessage(caughtError)
      setError(message)
      throw new Error(message, { cause: caughtError })
    } finally {
      setIsSavingExpense(false)
    }
  }

  async function toggleExpenseStatus(expenseId: string, isPaid: boolean) {
    try {
      setIsTogglingExpense(true)
      setError(null)

      const updatedMonth = await plannerService.toggleExpenseStatus({ expenseId, isPaid })
      applyUpdatedMonth(updatedMonth)
    } catch (caughtError) {
      const message = getErrorMessage(caughtError)
      setError(message)
      throw new Error(message, { cause: caughtError })
    } finally {
      setIsTogglingExpense(false)
    }
  }

  async function updateExpense(input: UpdateExpenseInput) {
    try {
      setIsSavingExpense(true)
      setError(null)

      const updatedMonth = await plannerService.updateExpense(input)
      applyUpdatedMonth(updatedMonth)
    } catch (caughtError) {
      const message = getErrorMessage(caughtError)
      setError(message)
      throw new Error(message, { cause: caughtError })
    } finally {
      setIsSavingExpense(false)
    }
  }

  async function deleteExpense(input: DeleteExpenseInput) {
    try {
      setIsSavingExpense(true)
      setError(null)

      const updatedMonth = await plannerService.deleteExpense(input)
      applyUpdatedMonth(updatedMonth)
    } catch (caughtError) {
      const message = getErrorMessage(caughtError)
      setError(message)
      throw new Error(message, { cause: caughtError })
    } finally {
      setIsSavingExpense(false)
    }
  }

  async function closeMonth(monthPeriodId: string, confirmClose: boolean) {
    const input: CloseMonthInput = { monthPeriodId, confirmClose }

    try {
      setIsClosingMonth(true)
      setError(null)

      const updatedMonth = await plannerService.closeMonth(input)
      applyUpdatedMonth(updatedMonth)
    } catch (caughtError) {
      const message = getErrorMessage(caughtError)
      setError(message)
      throw new Error(message, { cause: caughtError })
    } finally {
      setIsClosingMonth(false)
    }
  }

  const value = {
    availableYears,
    selectedYear,
    months,
    selectedMonth,
    selectedFortnightType,
    selectedFortnight,
    selectedFortnightExpenses,
    financialSummary,
    isLoading,
    isSavingIncome,
    isSavingExpense,
    isTogglingExpense,
    isClosingMonth,
    error,
    selectYear,
    selectMonth,
    selectFortnight,
    saveFortnightIncome,
    createExpense,
    toggleExpenseStatus,
    updateExpense,
    deleteExpense,
    closeMonth,
  } satisfies PlannerContextValue

  return <PlannerContext value={value}>{children}</PlannerContext>
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unexpected planner error.'
}
