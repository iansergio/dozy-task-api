import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import PasswordInput from "./PasswordInput"

const schema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
})

type FormData = z.infer<typeof schema>

export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [apiError, setApiError] = useState("")
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    })

    const onSubmit = async (data: FormData) => {
        setApiError("")
        setLoading(true)

        try {
            await login({ email: data.email, password: data.password })
            navigate("/")
        } catch {
            setApiError("Email ou senha inválidos")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 via-purple-50 to-slate-100 p-4 sm:p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-slate-200/60 p-6 sm:p-8">

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-3 shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                        To Do List
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Entre para continuar
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* EMAIL */}
                    <div>
                        <label className="block text-sm text-slate-600 mb-1">
                            Email
                        </label>
                        <input
                            {...register("email")}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none
                         focus:ring-2 focus:ring-violet-400 focus:border-violet-400 text-sm text-slate-800 placeholder:text-slate-400"
                            placeholder="seu@email.com"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <label className="block text-sm text-slate-600 mb-1">
                            Senha
                        </label>
                        <PasswordInput
                            {...register("password")}
                            placeholder="••••••••"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* API ERROR */}
                    {apiError && (
                        <p className="text-red-500 text-sm text-center">
                            {apiError}
                        </p>
                    )}

                    {/* BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white py-2.5 rounded-xl
                       hover:opacity-90 active:scale-[0.99]
                       disabled:opacity-70 disabled:cursor-not-allowed
                       transition font-semibold flex justify-center items-center gap-2 shadow-md"
                    >
                        {loading && (
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                        {loading ? "Entrando..." : "Entrar"}
                    </button>

                </form>

                <p className="text-sm text-slate-500 text-center mt-6">
                    Não tem conta?{" "}
                    <Link to="/register" className="text-violet-600 font-semibold hover:underline">
                        Criar conta
                    </Link>
                </p>

            </div>
        </div>
    )
}
