import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import CreateUserModal from '../components/CreateUserModal'

export default function AdminUsers() {
    const { users, loading, removeUser } = useAdmin()
    const [searchEmail, setSearchEmail] = useState('')
    const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'USER'>('ALL')
    const [showCreateModal, setShowCreateModal] = useState(false)

    const [userToDelete, setUserToDelete] = useState<{ id: string; email: string; role: string } | null>(null)
    const [deletingLoading, setDeletingLoading] = useState(false)

    const handleDeleteConfirm = async () => {
        if (!userToDelete) return
        setDeletingLoading(true)
        try {
            await removeUser(userToDelete.id)
            setUserToDelete(null)
        } finally {
            setDeletingLoading(false)
        }
    }

    const filteredUsers = users.filter((user) => {
        const matchesEmail = user.email.toLowerCase().includes(searchEmail.toLowerCase())
        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter
        return matchesEmail && matchesRole
    })

    if (loading) {
        return (
            <div className="flex justify-center mt-16">
                <span className="w-8 h-8 border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-full sm:max-w-6xl mx-auto px-4 sm:px-0 text-slate-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-800">Gerenciar Usuários</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold text-sm px-4 py-2 rounded-xl shadow-md hover:opacity-90 transition w-full sm:w-auto justify-center sm:justify-start"
                >
                    <span className="text-lg leading-none">+</span>
                    Novo Usuário
                </button>
            </div>

            <CreateUserModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />

            {/* Search and Filter */}
            <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Buscar por email..."
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none
                                   focus:ring-2 focus:ring-violet-400 focus:border-violet-400 text-sm text-slate-800 placeholder:text-slate-400"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as 'ALL' | 'ADMIN' | 'USER')}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none
                               focus:ring-2 focus:ring-violet-400 focus:border-violet-400 text-sm bg-slate-50 text-slate-800 w-full sm:w-auto"
                >
                    <option value="ALL">Todos os Roles</option>
                    <option value="ADMIN">Admin</option>
                    <option value="USER">User</option>
                </select>
            </div>

            {/* Users Table */}
            {filteredUsers.length === 0 ? (
                <div className="text-center mt-12 text-slate-400">
                    <p className="text-lg font-medium text-slate-600">Nenhum usuário encontrado</p>
                    <p className="text-sm mt-1 text-slate-400">Tente ajustar os filtros</p>
                </div>
            ) : (
                <>
                    {/* Mobile: Card Layout */}
                    <div className="md:hidden space-y-3">
                        {filteredUsers.map((user) => (
                            <div key={user.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-800 text-sm break-all">{user.email}</p>
                                        <span
                                            className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                user.role === 'ADMIN'
                                                    ? 'bg-violet-50 text-violet-600 border border-violet-200'
                                                    : 'bg-sky-50 text-sky-600 border border-sky-200'
                                            }`}
                                        >
                                            {user.role}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setUserToDelete({ id: user.id, email: user.email, role: user.role })}
                                        className="flex-shrink-0 text-red-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition font-medium text-xs"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="text-[10px] text-slate-400 break-all pt-2 border-t border-slate-100">
                                    <p className="font-mono">ID: {user.id}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop: Table Layout */}
                    <div className="hidden md:block overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-100">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Email</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Role</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">ID</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-600">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4 text-sm text-slate-800">{user.email}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    user.role === 'ADMIN'
                                                        ? 'bg-violet-50 text-violet-600 border border-violet-200'
                                                        : 'bg-sky-50 text-sky-600 border border-sky-200'
                                                }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400 font-mono break-all cursor-pointer hover:text-slate-600" title={user.id}>
                                            {user.id}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right">
                                            <button
                                                onClick={() => setUserToDelete({ id: user.id, email: user.email, role: user.role })}
                                                className="text-red-400 hover:text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg transition font-medium text-xs"
                                            >
                                                Deletar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            <p className="text-xs sm:text-sm text-slate-400 mt-4">
                Total: {filteredUsers.length} de {users.length} usuário(s)
            </p>

            {/* Delete Confirmation Modal */}
            {userToDelete && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
                    onClick={(e) => { if (e.target === e.currentTarget && !deletingLoading) setUserToDelete(null) }}
                >
                    <div className="w-full max-w-md bg-white border border-slate-200/60 rounded-3xl shadow-lg p-6 animate-slide-up">
                        <div className="flex gap-3 items-start mb-4">
                            <div className="text-3xl">⚠️</div>
                            <h2 className="text-lg font-semibold text-slate-800">Confirmar Exclusão</h2>
                        </div>

                        <div className="mb-6 space-y-3">
                            <p className="text-sm text-slate-600">
                                Tem certeza de que deseja deletar este usuário?
                            </p>
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                                <p className="text-xs text-slate-400 mb-1">Email</p>
                                <p className="font-medium text-sm text-slate-800 break-all">{userToDelete.email}</p>
                                <p className="text-xs text-slate-400 mt-2 mb-1">Tipo</p>
                                <p className={`font-medium text-sm ${userToDelete.role === 'ADMIN' ? 'text-violet-600' : 'text-sky-600'}`}>
                                    {userToDelete.role}
                                </p>
                            </div>
                            {userToDelete.role === 'ADMIN' && (
                                <div className="bg-red-50 rounded-xl p-3 border border-red-200">
                                    <p className="text-xs font-semibold text-red-500">
                                        ⚠️ Este é um usuário ADMIN. Esta ação não pode ser desfeita.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setUserToDelete(null)}
                                disabled={deletingLoading}
                                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-medium text-sm
                                         hover:bg-slate-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={deletingLoading}
                                className="flex-1 py-2.5 px-4 rounded-xl bg-red-500 text-white font-medium text-sm
                                         hover:bg-red-400 transition disabled:opacity-60 disabled:cursor-not-allowed
                                         flex items-center justify-center gap-2"
                            >
                                {deletingLoading && (
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                )}
                                {deletingLoading ? 'Deletando...' : 'Deletar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
