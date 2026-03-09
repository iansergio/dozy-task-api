import api from './api'

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW'
export type Status = 'PENDING' | 'COMPLETED'

export interface Task {
    id: string
    title: string
    description?: string
    priority: Priority
    status: Status
    dueDate?: string
    userId: string
}

export interface CreateTaskPayload {
    title: string
    description?: string
    priority?: Priority
    status?: Status
    dueDate?: string
}

export interface UpdateTaskInfoPayload {
    title?: string
    description?: string
    priority?: Priority
    dueDate?: string
}

export interface UpdateTaskStatusPayload {
    status: Status
}

export const fetchTasks = () => api.get<Task[]>('/tasks')
export const createTask = (data: CreateTaskPayload) => api.post<Task>('/tasks', data)
export const updateTaskInfo = (id: string, data: UpdateTaskInfoPayload) => api.patch<Task>(`/tasks/${id}/infos`, data)
export const updateTaskStatus = (id: string, data: UpdateTaskStatusPayload) => api.patch<Task>(`/tasks/${id}/status`, data)
export const deleteTask = (id: string) => api.delete(`/tasks/${id}`)
