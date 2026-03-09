import { useState } from 'react'
import { useTask } from '../context/TaskContext'
import AddTaskModal from '../components/AddTaskModal'
import EditTaskModal from '../components/EditTaskModal'
import type { Task } from '../services/taskApi'

const TASK_GRADIENTS = [
    'from-violet-300 to-purple-400',
    'from-sky-300 to-blue-400',
    'from-emerald-300 to-teal-400',
    'from-amber-300 to-orange-300',
    'from-fuchsia-300 to-violet-400',
]

function getGradient(task: Task, index: number): string {
    if (task.priority === 'HIGH') return 'from-rose-300 to-pink-400'
    if (task.priority === 'MEDIUM') return 'from-sky-300 to-blue-400'
    return TASK_GRADIENTS[index % TASK_GRADIENTS.length]
}

export default function Dashboard() {
    const { tasks, loading, toggleTask, removeTask, openModal } = useTask()
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
    const [deletingLoading, setDeletingLoading] = useState(false)

    const handleDeleteConfirm = async () => {
        if (!taskToDelete) return
        setDeletingLoading(true)
        try {
            await removeTask(taskToDelete.id)
            setTaskToDelete(null)
        } finally {
            setDeletingLoading(false)
        }
    }

    const pendingTasks = tasks.filter(t => t.status === 'PENDING')
    const completedTasks = tasks.filter(t => t.status === 'COMPLETED')

    const today = new Date().toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })

    return (
        <div className="bg-slate-50 min-h-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-5 sm:mb-6">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Minhas Tarefas</h1>
                        <p className="text-slate-400 text-xs sm:text-sm mt-0.5">{today}</p>
                    </div>
                    <button
                        onClick={openModal}
                        className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold text-sm shadow-md hover:opacity-90 transition"
                    >
                        <span className="text-lg leading-none">+</span>
                        <span>Nova Tarefa</span>
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-3 mb-5 sm:mb-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 sm:p-4 flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <p className="text-slate-700 font-semibold text-xs sm:text-sm truncate">Pendentes</p>
                            <p className="text-slate-400 text-xs">{pendingTasks.length} tarefas</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 sm:p-4 flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <p className="text-slate-700 font-semibold text-xs sm:text-sm truncate">Concluídas</p>
                            <p className="text-slate-400 text-xs">{completedTasks.length} tarefas</p>
                        </div>
                    </div>
                </div>

                <AddTaskModal />
                <EditTaskModal task={editingTask} onClose={() => setEditingTask(null)} />

                {loading ? (
                    <div className="flex justify-center mt-12">
                        <span className="w-8 h-8 border-4 border-violet-200 border-t-violet-500 rounded-full animate-spin" />
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-center mt-10">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-50 flex items-center justify-center">
                            <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <p className="font-semibold text-slate-500">Nenhuma tarefa ainda</p>
                        <p className="text-sm mt-1 text-slate-400">
                            Toque em <span className="font-semibold text-violet-500">+</span> para criar sua primeira tarefa
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5 sm:space-y-6">
                        {(['HIGH', 'MEDIUM', 'LOW'] as const).map((priority) => {
                            const grouped = tasks.filter(t => t.priority === priority)
                            if (grouped.length === 0) return null
                            const label = priority === 'HIGH' ? 'Alta' : priority === 'MEDIUM' ? 'Média' : 'Baixa'
                            const dotColor = priority === 'HIGH' ? 'bg-rose-400' : priority === 'MEDIUM' ? 'bg-sky-400' : 'bg-emerald-400'

                            return (
                                <div key={priority}>
                                    <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
                                        <span className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${dotColor}`} />
                                        <h3 className="text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-wide">{label}</h3>
                                        <span className="text-xs text-slate-400">({grouped.length})</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                                        {grouped.map((task, i) => {
                                            const gradient = getGradient(task, i)
                                            const isCompleted = task.status === 'COMPLETED'

                                            return (
                                                <div
                                                    key={task.id}
                                                    className={`rounded-2xl p-3.5 sm:p-4 shadow-sm bg-gradient-to-r ${gradient} flex flex-col gap-1.5 sm:gap-2 animate-scale-in`}
                                                    style={{ animationDelay: `${i * 50}ms` }}
                                                >
                                                    <div className="flex items-center gap-2.5 sm:gap-3">
                                                        <button
                                                            onClick={() => toggleTask(task.id, task.status)}
                                                            className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                                                                isCompleted ? 'bg-white border-white' : 'border-white/70 hover:border-white'
                                                            }`}
                                                            title={isCompleted ? 'Marcar como pendente' : 'Marcar como concluída'}
                                                        >
                                                            {isCompleted && (
                                                                <svg className="w-2.5 h-2.5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </button>

                                                        <p className={`flex-1 min-w-0 text-white font-bold text-sm truncate ${isCompleted ? 'line-through opacity-60' : ''}`}>
                                                            {task.title}
                                                        </p>

                                                        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                                                            <button
                                                                onClick={() => setEditingTask(task)}
                                                                className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/35 flex items-center justify-center transition"
                                                                title="Editar"
                                                            >
                                                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => setTaskToDelete(task)}
                                                                className="w-7 h-7 rounded-lg bg-white/20 hover:bg-rose-300/40 flex items-center justify-center transition"
                                                                title="Remover"
                                                            >
                                                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {task.description && (
                                                        <p className="text-white/70 text-xs leading-relaxed pl-7 sm:pl-8 line-clamp-2">
                                                            {task.description}
                                                        </p>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Mobile FAB */}
            <button
                onClick={openModal}
                className="sm:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg flex items-center justify-center z-30 hover:opacity-90 active:scale-95 transition animate-pop-in"
            >
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
            </button>

            {/* Delete Confirmation Modal */}
            {taskToDelete && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
                    onClick={(e) => { if (e.target === e.currentTarget && !deletingLoading) setTaskToDelete(null) }}
                >
                    <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg border border-slate-200/60 p-6 animate-slide-up">
                        <div className="flex gap-3 items-start mb-4">
                            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-800">Excluir tarefa?</h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    "<span className="font-medium text-slate-700">{taskToDelete.title}</span>" será removida permanentemente.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setTaskToDelete(null)}
                                disabled={deletingLoading}
                                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition disabled:opacity-60"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={deletingLoading}
                                className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white font-medium text-sm hover:bg-rose-400 transition disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {deletingLoading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                {deletingLoading ? 'Excluindo...' : 'Excluir'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

