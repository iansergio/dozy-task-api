import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { updatePassword } from '../services/userApi'
import PasswordInput from '../components/PasswordInput'

export default function UpdatePassword() {
    const { logout } = useAuth()
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const validate = (): boolean => {
        setError('')
        if (!currentPassword.trim()) {
            setError('Senha atual é obrigatória')
            return false
        }
        if (!newPassword.trim()) {
            setError('Nova senha é obrigatória')
            return false
        }
        if (newPassword.length < 6) {
            setError('Senha deve ter no mínimo 6 caracteres')
            return false
        }
        if (newPassword !== confirmPassword) {
            setError('As senhas não coincidem')
            return false
        }
        return true
    }

    const handleAskConfirm = (e: React.FormEvent) => {
        e.preventDefault()
        setSuccess(false)
        if (!validate()) return
        setShowConfirm(true)
    }

    const handleConfirm = async () => {
        setShowConfirm(false)
        setLoading(true)
        try {
            await updatePassword({ oldPassword: currentPassword.trim(), password: newPassword.trim() })
            setSuccess(true)
            setTimeout(() => logout(), 1500)
        } catch (err: any) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Erro ao atualizar senha. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = handleAskConfirm

    return (
        <div className="max-w-md mx-auto px-5 py-6">
            <h1 className="text-xl font-bold text-slate-800 mb-5">Alterar Senha</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Senha Atual</label>
                        <PasswordInput
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Digite sua senha atual"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Nova Senha</label>
                        <PasswordInput
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Mínimo 6 caracteres"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Confirmar Senha</label>
                        <PasswordInput
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirme a nova senha"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                            <p className="text-red-500 text-sm">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                            <p className="text-emerald-600 text-sm">Senha alterada com sucesso!</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold text-sm
                                   hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed
                                   flex items-center justify-center gap-2 shadow-md"
                    >
                        {loading && (
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                        {loading ? 'Salvando...' : 'Alterar Senha'}
                    </button>
                </form>

                <div className="mt-5 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-400">
                        ⚠️ Certifique-se de usar uma senha segura e única.
                    </p>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
                    onClick={(e) => { if (e.target === e.currentTarget) setShowConfirm(false) }}
                >
                    <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg border border-slate-200/60 p-6 animate-slide-up">
                        <div className="flex gap-3 items-start mb-4">
                            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-800">Alterar senha?</h2>
                                <p className="text-sm text-slate-500 mt-1">Tem certeza que deseja alterar sua senha?</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium text-sm hover:opacity-90 transition"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
