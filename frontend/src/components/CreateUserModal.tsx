import { useState } from 'react'
import { createUser } from '../services/adminApi'
import { useAdmin } from '../context/AdminContext'
import PasswordInput from './PasswordInput'

interface CreateUserModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
    const { refreshUsers } = useAdmin()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim()) return setError('Email é obrigatório')
        if (!password.trim()) return setError('Senha é obrigatória')
        setError('')
        setLoading(true)
        try {
            await createUser({
                email: email.trim(),
                password: password.trim(),
                name: name.trim() || undefined,
            })
            await refreshUsers()
            setEmail('')
            setPassword('')
            setName('')
            onClose()
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao criar usuário')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <div className="w-full max-w-md bg-white border border-slate-200/60 rounded-3xl shadow-lg p-6 text-slate-800 animate-slide-up">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-semibold text-slate-800">Novo Usuário</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition text-xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                        <input
                            autoFocus
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="usuario@exemplo.com"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none
                                       focus:ring-2 focus:ring-violet-400 focus:border-violet-400 text-sm text-slate-800 placeholder:text-slate-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Senha</label>
                        <PasswordInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mínimo 6 caracteres"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Nome <span className="text-slate-400">(opcional)</span></label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nome do usuário"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none
                                       focus:ring-2 focus:ring-violet-400 focus:border-violet-400 text-sm text-slate-800 placeholder:text-slate-400"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600
                                       hover:bg-slate-50 transition text-sm font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold text-sm
                                       hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed
                                       flex items-center justify-center gap-2 shadow-md"
                        >
                            {loading && (
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            )}
                            {loading ? 'Criando...' : 'Criar Usuário'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
