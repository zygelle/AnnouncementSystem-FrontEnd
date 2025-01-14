import api from "../../services/api/api.tsx";
import {useEffect, useState, useRef, useCallback} from "react";
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
    const [isChatListVisible, setChatListVisible] = useState<boolean>(true);
    const [isMdOrLarger, setIsMdOrLarger] = useState<boolean>(window.innerWidth >= 768);

    const chatListRef = useRef<HTMLDivElement>(null);

    const handleResize = () => {
        setIsMdOrLarger(window.innerWidth >= 768);
    };

    const addChatToStart = (newChat: Chat) => {
        setChats((prevChats) => [newChat, ...prevChats]);
    };

    const removeChatById = (id: string) => {
        setChats((prevChats) => prevChats.filter((chat) => chat.id !== id));
    };

    const fetchChats = useCallback(async () => {
        try {
            const response = await api.get(`chat?page=${page}&size=9`);
            const parsed = PaginatedChatSchema.safeParse(response.data);
            if (parsed.success) {
                setTotalPages(parsed.data.totalPages);
                if (page === 0) {
                    setChats(parsed.data.content);
                    if (!initialChat && parsed.data.content.length > 0) {
                        setSelectChat(parsed.data.content[0]);
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
    }, [page, initialChat]);

    const handleScroll = useCallback(() => {
        if (chatListRef.current) {
            const { scrollTop, clientHeight, scrollHeight } = chatListRef.current;
            if (scrollTop + clientHeight >= scrollHeight - 10 && page < totalPages - 1) {
                setPage((prev) => prev + 1);
            }
        }
    }, [page, totalPages]);

    useEffect(() => {
        fetchChats().catch((error) => {
            console.error("Erro ao buscar chats: " + error);
        });

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);

    }, [fetchChats]);

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
    }, [handleScroll]);

    return (
        <main className="h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 h-full">
                {(isChatListVisible || isMdOrLarger) && (
                    <div className="h-full flex flex-col">
                        <div
                            ref={chatListRef}
                            className="max-h-[70vh] overflow-y-auto"
                        >
                            {chats.length > 0 ? (
                                chats.map((chat) => (
                                    <ChatCards
                                        key={chat.id}
                                        chat={chat}
                                        setSelectChat={(chat) => {
                                            setSelectChat(chat);
                                            setChatListVisible(false);
                                        }}
                                    />
                                ))
                            ) : (
                                <div className="flex justify-center flex-1 text-gray-500">
                                    Nenhum chat disponível...
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {(!isChatListVisible || isMdOrLarger) && (
                    <div className="h-full flex flex-col">
                        {selectChat ? (
                            <TalkCards
                                chat={selectChat}
                                setChat={setSelectChat}
                                removeChatById={removeChatById}
                                addChatToStart={addChatToStart}
                                setChatListVisible={setChatListVisible}
                                isChatListVisible={isChatListVisible}
                                isMdOrLarger={isMdOrLarger}
                            />
                        ) : (
                            <div className="flex justify-center flex-1 text-gray-500">
                                Sem Chat
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}

export default Communication;



