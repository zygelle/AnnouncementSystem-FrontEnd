import api from "../../services/api.tsx";
import {useEffect, useState} from "react";
import {Chat, PaginatedChatSchema} from "../../schema/ChatSchema.tsx";
import ChatCards from "../../components/cards/ChatCards.tsx";
import TalkCards from "../../components/cards/TalkCards.tsx";

function Communication() {

    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [chats, setChats] = useState<Chat[]>([])
    const [selectChat, setSelectChat] = useState<Chat>();

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
        <main className="h-full">
            <div className="grid grid-cols-2 gap-4 h-full">
                <div
                    className="h-full flex flex-col">
                    {chats.length > 0 &&
                        chats.map((chat) => (
                            <ChatCards key={chat.id} chat={chat} setSelectChat={setSelectChat}/>
                        ))
                    }
                </div>
                <div
                    className="h-full flex flex-col">
                    {selectChat ? (
                        <TalkCards chat={selectChat}/>
                    ) : (
                        <div>Sem Chat</div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default Communication;