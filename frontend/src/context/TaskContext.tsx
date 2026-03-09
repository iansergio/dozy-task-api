import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import {
    fetchTasks,
    createTask,
    updateTaskInfo,
    updateTaskStatus,
    deleteTask,
    type Task,
    type CreateTaskPayload,
    type UpdateTaskInfoPayload,
    type Status,
} from '../services/taskApi'

interface TaskContextType {
    tasks: Task[]
    loading: boolean
    isModalOpen: boolean
    openModal: () => void
    closeModal: () => void
    addTask: (data: CreateTaskPayload) => Promise<void>
    updateTask: (id: string, data: UpdateTaskInfoPayload) => Promise<void>
    toggleTask: (id: string, currentStatus: Status) => Promise<void>
    removeTask: (id: string) => Promise<void>
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export const useTask = (): TaskContextType => {
    const ctx = useContext(TaskContext)
    if (!ctx) throw new Error('useTask must be used within a TaskProvider')
    return ctx
}

export const TaskProvider = ({ children }: { children: ReactNode }) => {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        fetchTasks()
            .then((res) => setTasks(res.data))
            .catch(() => setTasks([]))
            .finally(() => setLoading(false))
    }, [])

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    const addTask = async (data: CreateTaskPayload) => {
        const res = await createTask(data)
        setTasks((prev) => [res.data, ...prev])
    }

    const updateTask = async (id: string, data: UpdateTaskInfoPayload) => {
        const res = await updateTaskInfo(id, data)
        setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)))
    }

    const toggleTask = async (id: string, currentStatus: Status) => {
        const newStatus: Status = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED'
        const res = await updateTaskStatus(id, { status: newStatus })
        setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)))
    }

    const removeTask = async (id: string) => {
        await deleteTask(id)
        setTasks((prev) => prev.filter((t) => t.id !== id))
    }

    return (
        <TaskContext.Provider value={{ tasks, loading, isModalOpen, openModal, closeModal, addTask, updateTask, toggleTask, removeTask }}>
            {children}
        </TaskContext.Provider>
    )
}
