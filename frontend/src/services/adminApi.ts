import api from './api'

export interface User {
    id: string
    email: string
    role: string
}

export interface CreateUserPayload {
    email: string
    password?: string
    name?: string
}

export const getUsers = () => api.get<User[]>('/users')
export const getUserByEmail = (email: string) => api.get<User>(`/users/email/${email}`)
export const createUser = (data: CreateUserPayload) => api.post<User>('/users', data)
export const deleteUser = (id: string) => api.delete(`/users/${id}`)
