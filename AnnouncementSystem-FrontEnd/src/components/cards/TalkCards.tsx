import {
    Chat,
    receiveMessageSchema,
    reciveMessage,
    sendMessageSchema
} from "../../schema/ChatSchema.tsx";
import {getEmail, getToken} from "../../services/token.tsx";
import {useEffect, useRef, useState} from "react";
import {connectWebSocket, disconnectWebSocket, sendMessage} from "../../services/websocket.tsx";
import api from "../../services/api.tsx";

interface TalkCardProps {
    chat: Chat;
}

const TalkCards: React.FC<TalkCardProps> = ({ chat }) => {
    const [messages, setMessages] = useState<reciveMessage[]>([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const token = getToken();
    const messageEndRef = useRef<HTMLDivElement>(null);
    const email = getEmail();

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
                setMessages((prev) => [...prev, validatedMessage]);
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

    // Função para tratar o evento de tecla pressionada
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Evitar o comportamento padrão do Enter (ex.: nova linha)
            handleSendMessage();
        }
    };

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-full">
            {/* Cabeçalho do Chat */}
            <div className="bg-blue-800 text-white p-2">
                <div className="font-bold">{chat.announcement.title}</div>
                <div className="text-sm">{chat.participant.name}</div>
            </div>

            {/* Corpo do Chat */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${
                            message.sender.email === email ? "justify-end" : "justify-start"
                        } mb-2`}
                    >
                        <div
                            className={`max-w-xs p-2 rounded-lg text-sm ${
                                message.sender.email === email
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-300 text-black"
                            }`}
                        >
                            {message.message}
                        </div>
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>

            {/* Campo de Envio */}
            {chat.chatStatus=="OPEN" ? (
                <div className="p-2 bg-white flex items-center border-t">
                    <input
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyDown={handleKeyDown} // Adiciona o evento para capturar Enter
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
    );
};

export default TalkCards;

