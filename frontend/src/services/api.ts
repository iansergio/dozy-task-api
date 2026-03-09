import axios, { type AxiosInstance, AxiosError, type InternalAxiosRequestConfig } from 'axios'

interface TokenResponse {
    accessToken: string
    refreshToken?: string
}

const api: AxiosInstance = axios.create({
    baseURL: '/api',
})

// Intercepta as requisições para injetar o Access Token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Intercepta as respostas para lidar com o Refresh Token
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.startsWith('/auth/')) {
            originalRequest._retry = true

            try {
                const refreshToken = localStorage.getItem('refreshToken')

                const response = await axios.post<TokenResponse>('/api/auth/refresh', {
                    refreshToken: refreshToken
                })

                const { accessToken, refreshToken: newRefreshToken } = response.data

                // Atualiza os tokens no storage
                localStorage.setItem('accessToken', accessToken)
                if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken)

                // Refaz a requisição original que havia falhado
                originalRequest.headers.Authorization = `Bearer ${accessToken}`
                return api(originalRequest)
            } catch (refreshError) {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                window.location.href = '/login'
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)

export default api
