import api from "../../services/api.tsx";
import { useEffect, useState, useRef } from "react";
import { Chat, PaginatedChatSchema } from "../../schema/ChatSchema.tsx";
import ChatCards from "../../components/cards/ChatCards.tsx";
import TalkCards from "../../components/cards/TalkCards.tsx";
import { useLocation } from "react-router-dom";

function Communication() {
    const location = useLocation();
    const initialChat: Chat | null = location.state ? location.state.chat : null;

    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectChat, setSelectChat] = useState<Chat | null>(initialChat);
    const chatListRef = useRef<HTMLDivElement>(null); // Referência para o contêiner do scroll

    const fetchChats = async () => {
        try {
            const response = await api.get(`chat?page=${page}&size=10`);
            const parsed = PaginatedChatSchema.safeParse(response.data);
            if (parsed.success) {
                setTotalPages(parsed.data.totalPages);
                if (page === 0) {
                    setChats(parsed.data.content);
                    if (!initialChat && parsed.data.content.length > 0) {
                        setSelectChat(parsed.data.content[0]); // Seleciona o primeiro chat diretamente
                    }
                } else {
                    setChats((prev) => [...prev, ...parsed.data.content]);
                }
            } else {
                console.error("Erro de validação", parsed.error);
            }
        } catch (error) {
            console.error("Erro ao buscar os chats", error);
        }
    };

    const handleScroll = () => {
        if (chatListRef.current) {
            const { scrollTop, clientHeight, scrollHeight } = chatListRef.current;
            console.log(`ScrollTop: ${scrollTop}, ClientHeight: ${clientHeight}, ScrollHeight: ${scrollHeight}`);
            if (scrollTop + clientHeight >= scrollHeight - 10 && page < totalPages - 1) {
                setPage((prev) => prev + 1);
            }
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
                        className="max-h-[70vh] overflow-y-auto"
                    >
                        {chats.length > 0 ? (
                            chats.map((chat) => (
                                <ChatCards key={chat.id} chat={chat} setSelectChat={setSelectChat} />
                            ))
                        ) : (
                            <div className="text-center p-4 text-gray-500">Nenhum chat disponível</div>
                        )}
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

