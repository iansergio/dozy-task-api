import api from './api'

export interface UpdatePasswordPayload {
    oldPassword: string
    password: string
}

export const updatePassword = (data: UpdatePasswordPayload) =>
    api.patch('/users/me/password', data)
