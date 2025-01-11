import React, {useCallback, useState} from "react";
import {Chat, chatSchema} from "../../schema/ChatSchema.tsx";
import { getEmail, getToken } from "../../services/token.tsx";
import { useEffect, useRef } from "react";
import { connectWebSocket, disconnectWebSocket, sendMessage } from "../../services/websocket.tsx";
import api from "../../services/api/api.tsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowRight, faEllipsisVertical} from "@fortawesome/free-solid-svg-icons";
import {pathAssessment, setPathVisualizarAnuncio, setPathViewAdvertiser} from "../../routers/Paths.tsx";
import { useNavigate } from "react-router-dom";
import {formatDateChat} from "../../utils/formatDateChat.tsx";
import {receiveMessage, receiveMessageSchema} from "../../schema/ReceiveMessageSchema.tsx";
import {sendMessageSchema} from "../../schema/SendMessageSchema.tsx";

interface TalkCardProps {
    chat: Chat;
    setChat: (chat: Chat) => void;
    removeChatById: (id: string) => void;
    addChatToStart: (chat: Chat) => void;
    setChatListVisible: (visible: boolean) => void;
    isChatListVisible: boolean
    isMdOrLarger: boolean
}

const TalkCards: React.FC<TalkCardProps> = ({ chat, setChat, removeChatById, addChatToStart, setChatListVisible, isChatListVisible, isMdOrLarger }) => {
    const [messages, setMessages] = useState<receiveMessage[]>([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const token = getToken();
    const messageEndRef = useRef<HTMLDivElement>(null);
    const email = getEmail();
    const navigate = useNavigate();

    const fetchMessages = useCallback(async () => {
        try {
            const response = await api.get(`/chat/message/${chat.id}`);
            const oldMessages = response.data.map((message: unknown) => {
                return receiveMessageSchema.parse(message);
            });
            setMessages(oldMessages);
        } catch (error) {
            console.error("Erro ao buscar mensagens antigas:", error);
        }
    }, [chat.id]);

    useEffect(() => {
        const handleMessage = (message: unknown) => {
            try {
                const validatedMessage = receiveMessageSchema.parse(message);
                setMessages((prev) => [...prev, validatedMessage]);
            } catch (error) {
                console.error("Erro ao validar mensagem recebida:", error);
            }
        };

        fetchMessages().catch();
        connectWebSocket(token, handleMessage);
        setIsConnected(true);

        return () => {
            disconnectWebSocket();
            setIsConnected(false);
        };
    }, [fetchMessages, token, chat.id]);

    const handleSendMessage = () => {
        if (currentMessage.trim() === "") return;

        const messageData = {
            chat: chat.id,
            email: email,
            message: currentMessage,
        };

        try {
            const validatedMessage = sendMessageSchema.parse(messageData);
            sendMessage(validatedMessage);
            setCurrentMessage("");
        } catch (error) {
            console.error("Erro ao validar mensagem enviada:", error);
        }
    };

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleNavigateAnnouncement = () => {
        navigate(setPathVisualizarAnuncio(chat.announcement.id));
    };

    const handleToAssess = () => {
        navigate(pathAssessment, {
            state: { idChat: chat.id }
        })
    }

    const handleAuthor = () => {
        if (chat) {
            navigate(setPathViewAdvertiser(chat.participant.name), {
                state: { advertiserEmail: chat.participant.email },
            });
        } else {
            console.log("Erro ao acessar a página do anunciante.");
        }
    };

    const handleEndChat = () => {
        console.log("Chat encerrado");
        setMenuVisible(false);

        const closeChat = async () => {
            if (!chat) return;

            try {
                const response = await api.post(`/chat/close/${chat.id}`);
                const parsed = chatSchema.safeParse(response.data);
                if (parsed.success) {
                    removeChatById(chat.id)
                    addChatToStart(parsed.data)
                    setChat(parsed.data)
                } else {
                    console.error("Erro de validação:", parsed.error);
                }
            } catch (error) {
                console.error("Erro ao criar o chat:", error);
            }
        };

        closeChat().catch();
    };

    return (
        <div className="flex flex-col h-full">
            {isConnected ? (
                <div className="flex flex-col h-full">
                    <div className="bg-blue-800 text-white p-2 flex justify-betwee ">
                        {(!isChatListVisible && !isMdOrLarger) &&
                            <div className="text-start content-center m-1 p-1 items-center"
                                 onClick={() => setChatListVisible(true)}>
                                <FontAwesomeIcon icon={faArrowRight} rotation={180}
                                                 className="w-6 h-6 hover:cursor-pointer"/>
                            </div>
                        }
                        <div className="text-start w-full mx-1">
                            <div
                                className="font-bold hover:text-lg hover:cursor-pointer"
                                onClick={handleNavigateAnnouncement}
                            >
                            {chat.announcement.title}
                            </div>
                            <div
                                className="text-sm hover:cursor-pointer hover:font-bold"
                                onClick={handleAuthor}
                            >
                                {chat.participant.name}
                            </div>
                        </div>
                        <div
                            className="relative text-end content-center"
                            onMouseEnter={() => chat.chatStatus == "OPEN" ? setMenuVisible(true) : setMenuVisible(false)}
                            onMouseLeave={() => setMenuVisible(false)}
                        >
                            <FontAwesomeIcon
                                icon={faEllipsisVertical}
                                className={`w-6 h-6 ${
                                    chat.chatStatus === 'CLOSED' ? 'opacity-50' : 'hover:cursor-pointer'}`}
                            />
                            {menuVisible && (
                                <div
                                    className="absolute right-0 mt-2 w-fit bg-white border border-gray-300 rounded-lg shadow-lg">
                                    <div
                                        onClick={handleEndChat}
                                        className="text-black hover:bg-gray-100 w-fit text-nowrap rounded-lg text-center p-2 hover:cursor-pointer"
                                    >
                                        Encerrar Chat
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
                        <div className="max-h-[50vh] overflow-y-auto">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender.email === email ? "justify-end" : "justify-start"} mb-2`}
                                >
                                    <div
                                        className={`max-w-xs p-2 rounded-lg text-sm ${
                                            message.sender.email === email
                                                ? "bg-blue-500 text-white text-end"
                                                : "bg-gray-300 text-black"
                                        }`}
                                    >
                                        <div>{message.message}</div>
                                        <div className="text-xs text-blue-950 mt-1">{formatDateChat(message.date)}</div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messageEndRef} />
                        </div>
                    </div>
                    {chat.chatStatus == "OPEN" ? (
                        <div className="p-2 bg-white flex items-center border-t">
                            <input
                                type="text"
                                value={currentMessage}
                                onChange={(e) => setCurrentMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Digite sua mensagem"
                                className="flex-1 border border-gray-300 rounded-full p-2 mr-2"
                            />
                            <button
                                onClick={handleSendMessage}
                                className={`px-4 py-2 rounded-full ${
                                    currentMessage.trim()
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                                disabled={!currentMessage.trim()}
                            >
                                Enviar
                            </button>
                        </div>
                    ) : (
                        <div>
                            {chat.isEvaluated ? (
                                <div className="text-center p-4 text-gray-500 bg-gray-200">
                                    Chat Fechado
                                </div>
                            ) : (
                                <div className="text-center p-4 text-gray-500 bg-gray-200">
                                    <span className="hover:font-bold hover:cursor-pointer" onClick={handleToAssess} >Avalie</span> o usuário...
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex justify-center flex-1 text-gray-500">
                    Sem Conecção
                </div>
            )}
        </div>
    );
};

export default TalkCards;