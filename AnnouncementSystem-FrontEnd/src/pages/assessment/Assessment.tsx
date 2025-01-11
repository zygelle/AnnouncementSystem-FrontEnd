import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactStars from "react-stars";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { pathPerfil, pathCommunication } from "../../routers/Paths.tsx";
import api from "../../services/api/api.tsx";
import {CreateAssessment, createAssessmentSchema} from "../../schema/CreateAssessmentSchema.tsx";

function Assessment() {
    const location = useLocation();
    const idChat = location.state.idChat;
    const navigate = useNavigate();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<CreateAssessment>({
        resolver: zodResolver(createAssessmentSchema),
        defaultValues: {
            title: "",
            description: "",
            grade: 0,
            chat: idChat,
        },
    });

    const onSubmit = async (data: CreateAssessment) => {
        try {
            const response = await api.post("/assessment", data);
            alert("Avaliação enviada com sucesso!");
            navigate(pathPerfil);
            console.log("Resposta do backend:", response.data);
        } catch (error: any) {
            console.error("Erro ao enviar avaliação:", error.response?.data || error.message);
            alert("Erro ao enviar avaliação.");
            navigate(pathCommunication);
        }
    };

    return (
        <main>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                <label>Título</label>
                <input
                    {...register("title")}
                    type="text"
                    placeholder="Título"
                    className="w-full border border-slate-300 h-9 rounded-md outline-none px-2"
                />
                {errors.title && <span className='text-red-600'>{errors.title.message}</span>}
                <label className="mt-6">Descrição</label>
                <textarea
                    {...register("description")}
                    placeholder="Descrição"
                    className="block p-2 w-full text-gray-900 rounded-lg border border-gray-300 focus:outline-slate-300"
                />
                {errors.description && <span className='text-red-600'>{errors.description.message}</span>}

                <div className="flex flex-col items-center">
                    <label className="mt-6">Nota</label>
                    <ReactStars
                        count={5}
                        value={0}
                        size={50}
                        onChange={(value: number) => setValue("grade", value)}
                    />
                    {errors.grade && <span>{errors.grade.message}</span>}
                </div>

                <button type="submit" className="h-9 bg-blue-900 hover:bg-blue-700 rounded border-0 text-lg text-white px-4 mt-6">
                    Enviar
                </button>
            </form>
        </main>
    );
}

export default Assessment;