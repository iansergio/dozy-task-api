import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { getUsers, deleteUser, type User } from '../services/adminApi'

interface AdminContextType {
    users: User[]
    loading: boolean
    refreshUsers: () => Promise<void>
    removeUser: (id: string) => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export const useAdmin = (): AdminContextType => {
    const ctx = useContext(AdminContext)
    if (!ctx) throw new Error('useAdmin must be used within an AdminProvider')
    return ctx
}

export const AdminProvider = ({ children }: { children: ReactNode }) => {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        refreshUsers()
    }, [])

    const refreshUsers = async () => {
        try {
            setLoading(true)
            const res = await getUsers()
            setUsers(res.data)
        } catch {
            setUsers([])
        } finally {
            setLoading(false)
        }
    }

    const removeUser = async (id: string) => {
        await deleteUser(id)
        setUsers((prev) => prev.filter((u) => u.id !== id))
    }

    return (
        <AdminContext.Provider value={{ users, loading, refreshUsers, removeUser }}>
            {children}
        </AdminContext.Provider>
    )
}
