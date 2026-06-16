import type {
  CloseMonthInput,
  CreateExpenseInput,
  FortnightPeriod,
  MonthDetail,
  SaveFortnightIncomeInput,
  ToggleExpenseStatusInput,
  UpdateExpenseInput,
  YearData,
} from '../../shared/types/planner'

export interface PlannerService {
  getAvailableYears(): Promise<number[]>
  getYear(year: number): Promise<YearData>
  getMonth(year: number, month: number): Promise<MonthDetail>
  saveFortnightIncome(input: SaveFortnightIncomeInput): Promise<FortnightPeriod>
  createExpense(input: CreateExpenseInput): Promise<MonthDetail>
  toggleExpenseStatus(input: ToggleExpenseStatusInput): Promise<MonthDetail>
  updateExpense(input: UpdateExpenseInput): Promise<MonthDetail>
  closeMonth(input: CloseMonthInput): Promise<MonthDetail>
}
