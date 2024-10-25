import { InputHTMLAttributes } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {

}

export function Input(props: InputProps) {
    return(
        <input
        className="border border-slate-300 h-9 rounded-md outline-none px-2 mb-4 "
        {...props}
        />
    )
}