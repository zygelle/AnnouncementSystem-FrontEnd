import api from "../../services/api.tsx";
import { useEffect, useState, useRef } from "react";
import { Chat, PaginatedChatSchema } from "../../schema/ChatSchema.tsx";
import ChatCards from "../../components/cards/ChatCards.tsx";
import TalkCards from "../../components/cards/TalkCards.tsx";

function Communication() {
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectChat, setSelectChat] = useState<Chat>();
    const chatListRef = useRef<HTMLDivElement>(null); // Referência para o contêiner do scroll

    const fetchChats = async () => {
        try {
            const response = await api.get(`chat?page=${page}&size=5`);
            const parsed = PaginatedChatSchema.safeParse(response.data);
            if (parsed.success) {
                setTotalPages(parsed.data.totalPages);
                if (page === 0) {
                    setChats(parsed.data.content); // Carregar a primeira página de chats
                } else {
                    setChats((prev) => [...prev, ...parsed.data.content]); // Carregar chats adicionais
                }
            } else {
                console.error("Erro de validação", parsed.error);
            }
        } catch (error) {
            console.error("Erro ao buscar os chats", error);
        }
    };

    // Adiciona o evento de scroll infinito
    const handleScroll = () => {
        if (
            chatListRef.current &&
            chatListRef.current.scrollTop + chatListRef.current.clientHeight >= chatListRef.current.scrollHeight &&
            page < totalPages - 1
        ) {
            setPage((prev) => prev + 1); // Carregar a próxima página
        }
    };

    useEffect(() => {
        fetchChats();
    }, [page]);

    useEffect(() => {
        const chatListElement = chatListRef.current;
        if (chatListElement) {
            chatListElement.addEventListener("scroll", handleScroll);
        }
        return () => {
            if (chatListElement) {
                chatListElement.removeEventListener("scroll", handleScroll);
            }
        };
    }, [page]);

    return (
        <main className="h-full">
            <div className="grid grid-cols-2 gap-4 h-full">
                <div className="h-full flex flex-col">
                    <div
                        ref={chatListRef}
                        className="h-full overflow-y-auto max-h-[50vh] scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-400"
                    >
                        {chats.length > 0 &&
                            chats.map((chat) => (
                                <ChatCards key={chat.id} chat={chat} setSelectChat={setSelectChat} />
                            ))}
                    </div>
                </div>
                <div className="h-full flex flex-col">
                    {selectChat ? (
                        <TalkCards chat={selectChat} />
                    ) : (
                        <div>Sem Chat</div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default Communication;
