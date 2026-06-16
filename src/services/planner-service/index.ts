import type { PlannerService } from './planner-service'
import { plannerServiceApi } from './planner-service.api'
import { plannerServiceMock } from './planner-service.mock'

type PlannerServiceMode = 'mock' | 'api'

function getPlannerServiceMode(): PlannerServiceMode {
  const configuredMode = import.meta.env.VITE_PLANNER_SERVICE_MODE

  return configuredMode === 'mock' ? 'mock' : 'api'
}

export const plannerService: PlannerService =
  getPlannerServiceMode() === 'api' ? plannerServiceApi : plannerServiceMock

export const plannerServiceMode = getPlannerServiceMode()
