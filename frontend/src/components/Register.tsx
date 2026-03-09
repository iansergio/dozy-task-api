import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate, Link } from "react-router-dom"
import PasswordInput from "./PasswordInput"
import { useAuth } from "../context/AuthContext"

const schema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
})

type FormData = z.infer<typeof schema>

export default function Register() {
    const { register: registerUser } = useAuth()
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
            await registerUser({ name: data.name, email: data.email, password: data.password })
            navigate("/")
        } catch {
            setApiError("Erro ao criar conta. Tente novamente.")
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
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                        Criar conta
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Cadastre-se para começar
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* NAME */}
                    <div>
                        <label className="block text-sm text-slate-600 mb-1">
                            Nome
                        </label>
                        <input
                            {...register("name")}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none
                         focus:ring-2 focus:ring-violet-400 focus:border-violet-400 text-sm text-slate-800 placeholder:text-slate-400"
                            placeholder="Seu nome"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

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

                    {/* CONFIRM PASSWORD */}
                    <div>
                        <label className="block text-sm text-slate-600 mb-1">
                            Confirmar senha
                        </label>
                        <PasswordInput
                            {...register("confirmPassword")}
                            placeholder="••••••••"
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.confirmPassword.message}
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
                        {loading ? "Criando conta..." : "Criar conta"}
                    </button>

                </form>

                <p className="text-sm text-slate-500 text-center mt-6">
                    Já tem conta?{" "}
                    <Link to="/login" className="text-violet-600 font-semibold hover:underline">
                        Entrar
                    </Link>
                </p>

            </div>
        </div>
    )
}
