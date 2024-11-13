import { TextareaHTMLAttributes } from "react"

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {

}

export function Textarea(props: TextareaProps) {
    return(
        <textarea
        rows="3"
        className="block p-2 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:outline-slate-300"
        {...props}
        />
    )
}