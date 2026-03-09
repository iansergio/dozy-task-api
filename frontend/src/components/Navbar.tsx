import { useState, useRef, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate, useLocation } from "react-router-dom"

function isAdmin(): boolean {
    const token = localStorage.getItem('accessToken')
    if (!token) return false
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload.role === 'ADMIN'
    } catch {
        return false
    }
}

function getUserName(): string {
    const token = localStorage.getItem('accessToken')
    if (!token) return 'User'
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const raw = payload.name || payload.sub?.split('@')[0] || 'User'
        return raw.charAt(0).toUpperCase() + raw.slice(1)
    } catch {
        return 'User'
    }
}

export default function Navbar() {
    const { logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const admin = isAdmin()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const userMenuRef = useRef<HTMLDivElement>(null)
    const mobileMenuRef = useRef<HTMLDivElement>(null)

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false)
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
                setMobileOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const handleLogout = async () => {
        await logout()
        navigate("/login")
    }

    const handleNavClick = (path: string) => {
        setMobileOpen(false)
        navigate(path)
    }

    const isActive = (path: string) => location.pathname === path

    const linkClass = (path: string) =>
        `px-4 py-2 rounded-xl text-sm font-medium transition ${
            isActive(path)
                ? 'bg-violet-100 text-violet-700'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
        }`

    return (
        <nav className="w-full bg-white border-b border-slate-200/60 sticky top-0 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">

                {/* Logo */}
                <button
                    onClick={() => handleNavClick('/')}
                    className="flex items-center gap-2 text-violet-600 font-bold text-lg tracking-tight hover:text-violet-700 transition flex-shrink-0"
                >
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </span>
                    To Do List
                </button>

                {/* Desktop nav links */}
                <div className="hidden md:flex items-center gap-1 flex-1">
                    <button onClick={() => handleNavClick('/')} className={linkClass('/')}>
                        Minhas Tarefas
                    </button>
                    {admin && (
                        <>
                            <button onClick={() => handleNavClick('/admin/dashboard')} className={linkClass('/admin/dashboard')}>
                                Dashboard Admin
                            </button>
                            <button onClick={() => handleNavClick('/admin/users')} className={linkClass('/admin/users')}>
                                Usuários
                            </button>
                        </>
                    )}
                </div>

                {/* Desktop right side – user dropdown */}
                <div className="hidden md:block relative flex-shrink-0" ref={userMenuRef}>
                    <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200/60 hover:bg-slate-100 transition"
                    >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            {getUserName().charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-slate-600">{getUserName()}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {userMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200/60 py-1 z-50 animate-scale-in origin-top-right">
                            <button
                                onClick={() => { setUserMenuOpen(false); handleNavClick('/update-password') }}
                                className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                                Alterar senha
                            </button>
                            <div className="border-t border-slate-100 my-1" />
                            <button
                                onClick={() => { setUserMenuOpen(false); handleLogout() }}
                                className="w-full text-left px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                                </svg>
                                Sair
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile user button + dropdown */}
                <div className="md:hidden relative" ref={mobileMenuRef}>
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200/60 hover:bg-slate-100 transition"
                    >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            {getUserName().charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-slate-600 max-w-[100px] truncate">{getUserName()}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 text-slate-400 transition-transform ${mobileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {mobileOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200/60 py-1 z-50 animate-scale-in origin-top-right">
                            {/* Nav links */}
                            <button onClick={() => handleNavClick('/')} className={`w-full text-left ${linkClass('/')}`}>
                                Minhas Tarefas
                            </button>
                            {admin && (
                                <>
                                    <button onClick={() => handleNavClick('/admin/dashboard')} className={`w-full text-left ${linkClass('/admin/dashboard')}`}>
                                        Dashboard Admin
                                    </button>
                                    <button onClick={() => handleNavClick('/admin/users')} className={`w-full text-left ${linkClass('/admin/users')}`}>
                                        Usuários
                                    </button>
                                </>
                            )}

                            <div className="border-t border-slate-100 my-1" />

                            <button
                                onClick={() => handleNavClick('/update-password')}
                                className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                                Alterar senha
                            </button>
                            <button
                                onClick={() => { setMobileOpen(false); handleLogout() }}
                                className="w-full text-left px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                                </svg>
                                Sair
                            </button>
                        </div>
                    )}
                </div>
            </div>

        </nav>
    )
}
