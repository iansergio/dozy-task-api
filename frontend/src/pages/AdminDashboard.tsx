import { useAdmin } from '../context/AdminContext'
import { useTask } from '../context/TaskContext'

export default function AdminDashboard() {
    const { users, loading: usersLoading } = useAdmin()
    const { tasks, loading: tasksLoading } = useTask()

    const stats = {
        totalUsers: users.length,
        admins: users.filter(u => u.role === 'ADMIN').length,
        regularUsers: users.filter(u => u.role === 'USER').length,
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'COMPLETED').length,
        pendingTasks: tasks.filter(t => t.status === 'PENDING').length,
        overdueTasks: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status === 'PENDING').length,
        highPriorityTasks: tasks.filter(t => t.priority === 'HIGH').length,
    }

    const loading = usersLoading || tasksLoading

    if (loading) {
        return (
            <div className="flex justify-center mt-16">
                <span className="w-8 h-8 border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 sm:mb-8">Dashboard Admin</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {/* Users Stats */}
                <StatCard
                    title="Total de Usuários"
                    value={stats.totalUsers}
                    subtitle={`${stats.admins} admin(s), ${stats.regularUsers} user(s)`}
                    color="violet"
                />

                {/* Tasks Stats */}
                <StatCard
                    title="Total de Tarefas"
                    value={stats.totalTasks}
                    subtitle={`${stats.completedTasks} concluída(s)`}
                    color="emerald"
                />

                {/* Pending Tasks */}
                <StatCard
                    title="Tarefas Pendentes"
                    value={stats.pendingTasks}
                    subtitle={`${stats.overdueTasks} atrasada(s)`}
                    color="amber"
                />

                {/* High Priority Tasks */}
                <StatCard
                    title="Prioridade Alta"
                    value={stats.highPriorityTasks}
                    subtitle="Tarefas"
                    color="rose"
                />
            </div>

            {/* Completion Rate */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 sm:p-6 mb-6 sm:mb-8">
                <h2 className="text-base sm:text-lg font-semibold text-slate-800 mb-4">Taxa de Conclusão</h2>
                <div className="w-full bg-slate-200 rounded-full h-6 sm:h-8 overflow-hidden">
                    <div
                        className="bg-violet-500 h-full transition-all duration-500 flex items-center justify-end pr-2 sm:pr-3"
                        style={{ width: `${stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0}%` }}
                    >
                        {stats.totalTasks > 0 && (
                            <span className="text-[10px] sm:text-xs font-bold text-white">
                                {Math.round((stats.completedTasks / stats.totalTasks) * 100)}%
                            </span>
                        )}
                    </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-2">
                    {stats.completedTasks} de {stats.totalTasks} tarefas concluídas
                </p>
            </div>
        </div>
    )
}

function StatCard({
    title,
    value,
    subtitle,
    color,
}: {
    title: string
    value: number
    subtitle: string
    color: 'violet' | 'emerald' | 'amber' | 'rose'
}) {
    const colorMap = {
        violet: 'bg-violet-50 border-violet-200',
        emerald: 'bg-emerald-50 border-emerald-200',
        amber: 'bg-amber-50 border-amber-200',
        rose: 'bg-rose-50 border-rose-200',
    }

    const numberColorMap = {
        violet: 'text-violet-700',
        emerald: 'text-emerald-700',
        amber: 'text-amber-700',
        rose: 'text-rose-700',
    }

    return (
        <div className={`rounded-xl border p-3 sm:p-6 ${colorMap[color]}`}>
            <p className="text-xs sm:text-sm text-slate-600 mb-2">{title}</p>
            <p className={`text-3xl sm:text-4xl font-bold ${numberColorMap[color]}`}>{value}</p>
            <p className="text-xs text-slate-500 mt-1 sm:mt-2">{subtitle}</p>
        </div>
    )
}
