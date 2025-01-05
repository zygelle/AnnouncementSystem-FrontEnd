import {Chat, receiveMessageSchema, reciveMessage, sendMessageSchema} from "../../schema/ChatSchema.tsx";
import {getEmail, getToken} from "../../services/token.tsx";
import {useEffect, useRef, useState} from "react";
import {connectWebSocket, disconnectWebSocket, sendMessage} from "../../services/websocket.tsx";
import api from "../../services/api.tsx";


interface TalkCardProps {
    chat: Chat;
}

const TalkCards: React.FC<TalkCardProps> = ({ chat }) => {
    const [messages, setMessages] = useState<reciveMessage[]>([]); // Lista de mensagens
    const [currentMessage, setCurrentMessage] = useState(""); // Mensagem atual
    const [isConnected, setIsConnected] = useState(false); // Status da conexão WebSocket
    const token = getToken(); // Token do usuário
    const messageEndRef = useRef<HTMLDivElement>(null);
    const email = getEmail();

    // Função para buscar mensagens antigas
    const fetchMessages = async () => {
        try {
            const response = await api.get(`/chat/message/${chat.id}`);
            const oldMessages = response.data.map((message: unknown) => {
                // Validação Zod para cada mensagem recebida
                return receiveMessageSchema.parse(message);
            });
            setMessages(oldMessages);
        } catch (error) {
            console.error("Erro ao buscar mensagens antigas:", error);
        }
    };

    // Conecta ao WebSocket e busca mensagens antigas
    useEffect(() => {
        // Callback para mensagens recebidas em tempo real
        const handleMessage = (message: unknown) => {
            try {
                const validatedMessage = receiveMessageSchema.parse(message);
                setMessages((prev) => [...prev, validatedMessage]);
            } catch (error) {
                console.error("Erro ao validar mensagem recebida:", error);
            }
        };

        // Buscar mensagens antigas
        fetchMessages();

        // Conectar ao WebSocket
        connectWebSocket(token, handleMessage);
        setIsConnected(true);

        return () => {
            disconnectWebSocket();
            setIsConnected(false);
        };
    }, [token, chat.id]);

    // Função para envio de mensagens
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
            setCurrentMessage(""); // Limpar campo de mensagem
        } catch (error) {
            console.error("Erro ao validar mensagem enviada:", error);
        }
    };

    // Scroll automático para a última mensagem
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
                        className={`p-2 mb-2 rounded-lg ${
                            message.sender.email === email
                                ? "bg-blue-500 text-white self-end"
                                : "bg-gray-300 text-black self-start"
                        }`}
                    >
                        {message.message}
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>

            {/* Campo de Envio */}
            <div className="p-2 bg-white flex items-center">
                <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Digite sua mensagem"
                    className="flex-1 border border-gray-300 rounded-lg p-2 mr-2"
                />
                <button
                    onClick={handleSendMessage}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    Enviar
                </button>
            </div>
        </div>
    );
};

export default TalkCards;
