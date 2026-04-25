// Frontend API client service
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const messageService = {
  create: (data: any) => apiClient.post('/api/v1/messages', data),
  get: (id: string) => apiClient.get(`/api/v1/messages/${id}`),
  list: (skip = 0, limit = 10) => apiClient.get('/api/v1/messages', { params: { skip, limit } }),
  update: (id: string, data: any) => apiClient.put(`/api/v1/messages/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/v1/messages/${id}`),
}

export const ticketService = {
  create: (data: any) => apiClient.post('/api/v1/tickets', data),
  get: (id: string) => apiClient.get(`/api/v1/tickets/${id}`),
  list: (skip = 0, limit = 10) => apiClient.get('/api/v1/tickets', { params: { skip, limit } }),
  update: (id: string, data: any) => apiClient.put(`/api/v1/tickets/${id}`, data),
  assign: (id: string, agentId: string) => apiClient.post(`/api/v1/tickets/${id}/assign`, { agent_id: agentId }),
  resolve: (id: string) => apiClient.post(`/api/v1/tickets/${id}/resolve`),
}

export const customerService = {
  get: (id: string) => apiClient.get(`/api/v1/customers/${id}`),
  getContext: (id: string) => apiClient.get(`/api/v1/customers/${id}/context`),
  update: (id: string, data: any) => apiClient.put(`/api/v1/customers/${id}`, data),
}

export const analyticsService = {
  getSLA: (startDate: string, endDate: string) => apiClient.get('/api/v1/analytics/sla', { params: { start_date: startDate, end_date: endDate } }),
  getChannels: () => apiClient.get('/api/v1/analytics/channels'),
  getAgents: () => apiClient.get('/api/v1/analytics/agents'),
  getCustomers: () => apiClient.get('/api/v1/analytics/customers'),
}

export default apiClient
