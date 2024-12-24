import api from "../../services/api.tsx";
import {useEffect, useState} from "react";
import {Chat, PaginatedChatSchema} from "../../schema/ChatSchema.tsx";
import ChatCards from "../../components/cards/ChatCards.tsx";

function Communication() {

    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [chats, setChats] = useState<Chat[]>([])

    const fetchChats = async () => {
        try {
            const response = await api.get(`chat?page=${page}&size=5`)
            console.log(response)
            const parsed = PaginatedChatSchema.safeParse(response.data)
            console.log(parsed)
            if(parsed.success){
                console.log("Tranformação com sucesso")
                setTotalPages(parsed.data.totalPages)
                setChats(parsed.data.content)
            }else {
                console.error("Erro de validação", parsed.error);
            }
        }catch (error) {
            console.error("Erro ao buscar os anúncios", error);
        } finally {
            console.log("Finalizado")
        }
    }

    useEffect(() => {
        fetchChats()
    }, [page]);

    return (
        <main>
            <div className="grid grid-cols-2">
                <div>
                    {chats.length > 0 &&
                        chats.map((chat) =>
                            <ChatCards key={chat.id} chat={chat}/>
                        )
                    }
                </div>
                <div>
                    Chat
                </div>
            </div>
        </main>
    );
}

export default Communication;