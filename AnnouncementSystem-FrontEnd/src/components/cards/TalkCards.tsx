import { useState } from "react";
import { Chat, receiveMessageSchema, reciveMessage, sendMessageSchema } from "../../schema/ChatSchema.tsx";
import { getEmail, getToken } from "../../services/token.tsx";
import { useEffect, useRef } from "react";
import { connectWebSocket, disconnectWebSocket, sendMessage } from "../../services/websocket.tsx";
import api from "../../services/api.tsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { setPathVisualizarAnuncio, setPathVizualizarAnunciante } from "../../routers/Paths.tsx";
import { useNavigate } from "react-router-dom";

interface TalkCardProps {
    chat: Chat;
}

const TalkCards: React.FC<TalkCardProps> = ({ chat }) => {
    const [messages, setMessages] = useState<reciveMessage[]>([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [menuVisible, setMenuVisible] = useState(false); // Controle de visibilidade do menu
    const token = getToken();
    const messageEndRef = useRef<HTMLDivElement>(null);
    const email = getEmail();
    const navigate = useNavigate();

    const fetchMessages = async () => {
        try {
            const response = await api.get(`/chat/message/${chat.id}`);
            const oldMessages = response.data.map((message: unknown) => {
                return receiveMessageSchema.parse(message);
            });
            setMessages(oldMessages);
        } catch (error) {
            console.error("Erro ao buscar mensagens antigas:", error);
        }
    };

    useEffect(() => {
        const handleMessage = (message: unknown) => {
            try {
                const validatedMessage = receiveMessageSchema.parse(message);
                setMessages((prev) => [...prev, validatedMessage]); // Adiciona as mensagens no final
            } catch (error) {
                console.error("Erro ao validar mensagem recebida:", error);
            }
        };

        fetchMessages();
        connectWebSocket(token, handleMessage);
        setIsConnected(true);

        return () => {
            disconnectWebSocket();
            setIsConnected(false);
        };
    }, [token, chat.id]);

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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
        }
    };

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const formatDate = (dateString: string) => {
        const messageDate = new Date(dateString);
        const now = new Date();
        const diffTime = now.getTime() - messageDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

        if (diffDays === 0) {
            return `Hoje, ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else if (diffDays === 1) {
            return `Ontem, ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            return messageDate.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }) + ", " +
                messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    };

    const handleNavigateAnnouncement = () => {
        navigate(setPathVisualizarAnuncio(chat.announcement.id));
    };

    const handleAuthor = () => {
        if (chat) {
            navigate(setPathVizualizarAnunciante(chat.participant.name), {
                state: { email: chat.participant.email },
            });
        } else {
            console.log("Erro ao acessar a página do anunciante.");
        }
    };

    const handleEndChat = () => {
        console.log("Chat encerrado");
        setMenuVisible(false);
    };

    return (
        <div className="flex flex-col h-full">
            {isConnected ? (
                <div className="flex flex-col h-full">
                    <div className="bg-blue-800 text-white p-2 flex justify-between">
                        <div>
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
                            onMouseEnter={() => setMenuVisible(true)}
                            onMouseLeave={() => setMenuVisible(false)}
                        >
                            <FontAwesomeIcon
                                icon={faEllipsisVertical}
                                className="w-6 h-6 cursor-pointer"
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
                                        <div className="text-xs text-blue-950 mt-1">{formatDate(message.date)}</div>
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
                        <div className="text-center p-4 text-gray-500 bg-gray-200">
                            Chat Fechado
                        </div>
                    )}
                </div>
            ) : (
                <div>Sem Conecção</div>
            )}
        </div>
    );
};

export default TalkCards;