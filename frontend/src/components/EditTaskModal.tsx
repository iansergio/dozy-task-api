import { useState, useEffect } from 'react'
import { useTask } from '../context/TaskContext'
import type { Priority, Task } from '../services/taskApi'

interface EditTaskModalProps {
    task: Task | null
    onClose: () => void
}

export default function EditTaskModal({ task, onClose }: EditTaskModalProps) {
    const { updateTask } = useTask()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState<Priority>('MEDIUM')
    const [dueDate, setDueDate] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showConfirm, setShowConfirm] = useState(false)

    useEffect(() => {
        if (task) {
            setTitle(task.title)
            setDescription(task.description || '')
            setPriority(task.priority)
            setDueDate(task.dueDate ? task.dueDate.slice(0, 16) : '')
        }
    }, [task])

    if (!task) return null

    const setQuickDate = (hours: number) => {
        const date = new Date()
        date.setHours(date.getHours() + hours)
        const pad = (n: number) => String(n).padStart(2, '0')
        setDueDate(`${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return setError('O título é obrigatório')
        setError('')
        setShowConfirm(true)
    }

    const handleConfirmSave = async () => {
        setShowConfirm(false)
        setLoading(true)
        try {
            await updateTask(task.id, {
                title: title.trim(),
                description: description.trim() || undefined,
                priority,
                dueDate: dueDate || undefined
            })
            onClose()
        } catch {
            setError('Erro ao atualizar tarefa. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 text-slate-800 relative animate-slide-up">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-slate-800">Editar tarefa</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition text-xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Título</label>
                        <input
                            autoFocus
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Nome da tarefa"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none
                                       focus:ring-2 focus:ring-violet-400 focus:border-violet-400 text-sm text-slate-800 placeholder:text-slate-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Descrição <span className="text-slate-400">(opcional)</span></label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Detalhes da tarefa..."
                            rows={3}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none
                                       focus:ring-2 focus:ring-violet-400 focus:border-violet-400 text-sm text-slate-800 placeholder:text-slate-400 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Prioridade</label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as Priority)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none
                                       focus:ring-2 focus:ring-violet-400 focus:border-violet-400 text-sm text-slate-800"
                        >
                            <option value="LOW">Baixa</option>
                            <option value="MEDIUM">Média</option>
                            <option value="HIGH">Alta</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                            Data de vencimento <span className="text-slate-400">(opcional)</span>
                        </label>
                        
                        {/* Botões de atalho */}
                        <div className="flex flex-wrap gap-2 mb-2">
                            <button
                                type="button"
                                onClick={() => setQuickDate(2)}
                                className="px-3 py-1 text-xs rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 transition border border-violet-200"
                            >
                                Daqui 2h
                            </button>
                            <button
                                type="button"
                                onClick={() => setQuickDate(24)}
                                className="px-3 py-1 text-xs rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 transition border border-violet-200"
                            >
                                Amanhã
                            </button>
                            <button
                                type="button"
                                onClick={() => setQuickDate(168)}
                                className="px-3 py-1 text-xs rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 transition border border-violet-200"
                            >
                                Próxima semana
                            </button>
                            {dueDate && (
                                <button
                                    type="button"
                                    onClick={() => setDueDate('')}
                                    className="px-3 py-1 text-xs rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition ml-auto border border-red-200"
                                >
                                    Limpar
                                </button>
                            )}
                        </div>
                        
                        <input
                            type="datetime-local"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none
                                       focus:ring-2 focus:ring-violet-400 focus:border-violet-400 text-sm text-slate-800"
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
                            {loading ? 'Salvando...' : 'Salvar alterações'}
                        </button>
                    </div>
                </form>

                {/* Save Confirmation */}
                {showConfirm && (
                    <div className="absolute inset-0 bg-white/95 rounded-3xl flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                        <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center mb-3">
                            <svg className="w-6 h-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-1">Salvar alterações?</h3>
                        <p className="text-sm text-slate-500 mb-5">As mudanças serão aplicadas à tarefa.</p>
                        <div className="flex gap-3 w-full max-w-xs">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition"
                            >
                                Voltar
                            </button>
                            <button
                                onClick={handleConfirmSave}
                                disabled={loading}
                                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium text-sm hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                {loading ? 'Salvando...' : 'Confirmar'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
