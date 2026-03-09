import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { TaskProvider } from './context/TaskContext'
import { AdminProvider } from './context/AdminContext'
import Login from './components/Login'
import Register from './components/Register'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import UpdatePassword from './pages/UpdatePassword'

function isAdmin(): boolean {
    const token = localStorage.getItem('accessToken')
    if (!token) return false
    
    try {
        // JWT format: header.payload.signature
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload.role === 'ADMIN'
    } catch {
        return false
    }
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuth()

    if (loading) return null

    if (!isAuthenticated) return <Navigate to="/login" replace />

    return (
        <TaskProvider>
            <div className="min-h-screen flex flex-col bg-slate-50">
                <Navbar />
                <main className="flex-1">{children}</main>
            </div>
        </TaskProvider>
    )
}

function AdminRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuth()
    const location = useLocation()

    if (loading) return null

    if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />

    if (!isAdmin()) return <Navigate to="/" replace />

    return (
        <AdminProvider>
            <TaskProvider>
                <div className="min-h-screen flex flex-col bg-slate-50">
                    <Navbar />
                    <main className="flex-1 p-4 sm:p-6">{children}</main>
                </div>
            </TaskProvider>
        </AdminProvider>
    )
}

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route
                path="/update-password"
                element={
                    <ProtectedRoute>
                        <UpdatePassword />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
        </Routes>
    )
}
