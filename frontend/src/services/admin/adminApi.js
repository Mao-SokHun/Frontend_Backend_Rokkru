import { apiRequest } from '../core/client'
import { ENDPOINTS } from '../core/endpoints'
import { isApiEnabled } from '@/constants'

export async function fetchAdminReports() {
  if (isApiEnabled()) {
    return apiRequest(ENDPOINTS.admin.reports)
  }
  return {
    users: 0,
    teachers: 0,
    sessions: 0,
    revenue: 0,
  }
}
