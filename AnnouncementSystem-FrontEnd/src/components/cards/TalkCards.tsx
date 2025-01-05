import {Chat, receiveMessageSchema, reciveMessage, sendMessageSchema} from "../../schema/ChatSchema.tsx";
import {getEmail, getToken} from "../../services/token.tsx";
import {useEffect, useRef, useState} from "react";
import {connectWebSocket, disconnectWebSocket, sendMessage} from "../../services/websocket.tsx";

interface TalkCardProps {
    chat: Chat;
}

const TalkCards: React.FC<TalkCardProps> = ({chat}) => {

    const [messages, setMessages] = useState<reciveMessage[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    const messageEndRef = useRef<HTMLDivElement>(null);
    const token = getToken();

    useEffect(() => {

        // Callback para tratar mensagens recebidas
        const handleMessage = (message: unknown) => {
            console.log('Mensagem recebida do WebSocket:', message);
            try {
                const validatedMessage = receiveMessageSchema.parse(message);

                // Validação adicional para o campo `date` como um ISO 8601 válido
                const parsedDate = new Date(validatedMessage.date);
                if (isNaN(parsedDate.getTime())) {
                    throw new Error("Data inválida");
                }

                setMessages((prevMessages) => [...prevMessages, validatedMessage]);
            } catch (error) {
                console.error('Erro ao validar mensagem recebida:', error);
            }
        };

        // Conecta ao WebSocket
        connectWebSocket(token, handleMessage);
        setIsConnected(true);

        return () => {
            // Desconecta do WebSocket ao desmontar o componente
            disconnectWebSocket();
            setIsConnected(false);
        };
    }, [token]);

    const handleSendMessage = () => {
        if (currentMessage.trim() === '') return;

        const messageData = {
            chat: chat.id,
            email: getEmail(),
            message: currentMessage,
        };

        try {
            const validatedMessage = sendMessageSchema.parse(messageData);
            console.log('Enviando mensagem:', validatedMessage); // Log para verificar o envio
            sendMessage(validatedMessage);
            setCurrentMessage('');
        } catch (error) {
            console.error('Erro ao validar mensagem enviada:', error);
        }
    };

    return (
        <div className="flex flex-col">
            <div className="bg-blue-800 text-white mb-2 p-1">
                <div className="font-bold">{chat.announcement.title}</div>
                <div className="text-sm">{chat.participant.name}</div>
            </div>
            <div>
                mensagens
            </div>
        </div>
    );
};

export default TalkCards;