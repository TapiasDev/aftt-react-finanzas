import { apiRequest } from '../../shared/lib/http'
import type {
  CreateExpenseInput,
  DeleteExpenseInput,
  FortnightPeriod,
  MonthDetail,
  SaveFortnightIncomeInput,
  ToggleExpenseStatusInput,
  UpdateExpenseInput,
  YearData,
} from '../../shared/types/planner'
import type { PlannerService } from './planner-service'

export const plannerServiceApi: PlannerService = {
  async getAvailableYears() {
    return apiRequest<number[]>('/planner/years')
  },

  async getYear(year: number) {
    return apiRequest<YearData>(`/planner/years/${year}`)
  },

  async getMonth(year: number, month: number) {
    return apiRequest<MonthDetail>(`/planner/years/${year}/months/${month}`)
  },

  async saveFortnightIncome(input: SaveFortnightIncomeInput) {
    return apiRequest<FortnightPeriod>(`/planner/fortnights/${input.fortnightPeriodId}/income`, {
      method: 'PATCH',
      body: {
        incomeAmount: input.incomeAmount,
      },
    })
  },

  async createExpense(input: CreateExpenseInput) {
    return apiRequest<MonthDetail>('/planner/expenses', {
      method: 'POST',
      body: {
        fortnightPeriodId: input.fortnightPeriodId,
        name: input.name,
        amount: input.amount,
        estimatedPaymentDate: input.estimatedPaymentDate,
        description: input.description,
        recurrence: {
          mode: input.recurrenceMode,
        },
      },
    })
  },

  async toggleExpenseStatus(input: ToggleExpenseStatusInput) {
    return apiRequest<MonthDetail>(`/planner/expenses/${input.expenseId}/status`, {
      method: 'PATCH',
      body: {
        isPaid: input.isPaid,
      },
    })
  },

  async updateExpense(input: UpdateExpenseInput) {
    return apiRequest<MonthDetail>(`/planner/expenses/${input.expenseId}`, {
      method: 'PUT',
      body: {
        name: input.name,
        amount: input.amount,
        estimatedPaymentDate: input.estimatedPaymentDate,
        description: input.description,
        applyScope: {
          scope: input.applyScope,
        },
      },
    })
  },

  async deleteExpense(input: DeleteExpenseInput) {
    return apiRequest<MonthDetail>(`/planner/expenses/${input.expenseId}`, {
      method: 'DELETE',
      body: {
        applyScope: {
          scope: input.applyScope,
        },
      },
    })
  },
}
