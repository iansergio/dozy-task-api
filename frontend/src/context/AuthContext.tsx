import { createContext, useState, useEffect, type ReactNode, useContext } from 'react'
import api from '../services/api'

interface User {
    token?: string
    [key: string]: unknown
}

interface Credentials {
    email: string
    password: string
}

interface RegisterData {
    name: string
    email: string
    password: string
}

interface AuthContextType {
    isAuthenticated: boolean
    user: User | null
    login: (credentials: Credentials) => Promise<boolean>
    register: (data: RegisterData) => Promise<void>
    logout: () => Promise<void>
    loading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        if (token) {
            // Aqui você poderia decodificar o JWT para pegar dados do usuário
            // ou fazer uma chamada a um endpoint /me
            setUser({ token })
        }
        setLoading(false)
    }, [])

    const login = async (credentials: Credentials): Promise<boolean> => {
        try {
            const response = await api.post('/auth/login', credentials)
            const { accessToken, refreshToken, ...userData } = response.data

            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', refreshToken)

            setUser(userData) // Salva os dados do usuário no estado
            return true
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: { error?: string } } }
                console.error('Erro no login:', axiosError.response?.data?.error)
            }
            throw error
        }
    }

    const register = async (data: RegisterData): Promise<void> => {
        const response = await api.post('/auth/register', data)
        const { accessToken, refreshToken, ...userData } = response.data

        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)

        setUser(userData)
    }

    const logout = async (): Promise<void> => {
        try {
            const refreshToken = localStorage.getItem('refreshToken')
            // Chama a rota /logout do seu Controller
            if (refreshToken) {
                await api.post('/auth/logout', { refreshToken })
            }
        } catch (error) {
            console.error('Erro ao fazer logout no backend', error)
        } finally {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            setUser(null)
        }
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}
