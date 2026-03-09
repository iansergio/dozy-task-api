import { useState, type InputHTMLAttributes } from 'react'

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
    inputClassName?: string
}

export default function PasswordInput({ inputClassName, className, ...props }: PasswordInputProps) {
    const [show, setShow] = useState(false)

    return (
        <div className={`relative ${className ?? ''}`}>
            <input
                {...props}
                type={show ? 'text' : 'password'}
                className={inputClassName ?? "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-10 outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 text-sm text-slate-800 placeholder:text-slate-400"}
            />
            <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                tabIndex={-1}
            >
                {show ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.543-7z" />
                    </svg>
                )}
            </button>
        </div>
    )
}
