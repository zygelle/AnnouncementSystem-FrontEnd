import { useState, useEffect, useRef } from 'react';
import { connectWebSocket, sendMessage, disconnectWebSocket } from '../../services/websocket.tsx';
import {sendMessageSchema, receiveMessageSchema, reciveMessage} from '../../schema/ChatSchema.tsx';
import {getEmail, getToken} from "../../services/token.tsx";

function Communication() {
    const [messages, setMessages] = useState<reciveMessage[]>([]); // Lista de mensagens recebidas
    const [currentMessage, setCurrentMessage] = useState(''); // Conteúdo da mensagem atual
    const [isConnected, setIsConnected] = useState(false); // Estado de conexão

    const messageEndRef = useRef<HTMLDivElement>(null); // Para rolar automaticamente para o final da lista de mensagens

    // Simula o token JWT do usuário (substitua pelo token real em um ambiente de produção)
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

    // Envia uma mensagem ao servidor
    const handleSendMessage = () => {
        if (currentMessage.trim() === '') return;

        const messageData = {
            chat: "6e41c98b-0c13-4bae-942d-710efa65986c",
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

    // Rola para o final da lista de mensagens sempre que uma nova mensagem chegar
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        console.log('Mensagens no estado:', messages);
    }, [messages]);

    return (
        <main className="flex flex-col h-full max-w-2xl mx-auto bg-gray-100 border border-gray-300 rounded-lg shadow-md">
            {/* Header */}
            <header className="p-4 bg-blue-500 text-white font-bold text-center rounded-t-lg">
                Chat em Tempo Real
            </header>

            {/* Lista de Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
                {messages.map((msg) => {
                    console.log('Renderizando mensagem:', msg);
                    return (
                        <div
                            key={msg.id}
                            className={`p-2 rounded-lg shadow-sm w-fit max-w-xs ${
                                msg.sender.email === getEmail() ? 'ml-auto bg-blue-100' : 'mr-auto bg-gray-200'
                            }`}
                        >
                            <p className="text-sm font-semibold text-gray-800">{msg.sender.name}</p>
                            <p className="text-sm text-gray-600">{msg.message}</p>
                            <span className="text-xs text-gray-500">{new Date(msg.date).toLocaleString()}</span>
                        </div>
                    );
                })}

                <div ref={messageEndRef}></div>
            </div>

            {/* Input para Enviar Mensagens */}
            <div className="p-4 bg-gray-200 rounded-b-lg flex items-center space-x-2">
                <input
                    type="text"
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Digite sua mensagem..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                />
                <button
                    onClick={handleSendMessage}
                    className="p-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                >
                    Enviar
                </button>
            </div>

            {/* Status de Conexão */}
            {!isConnected && (
                <p className="p-2 text-center text-red-500">Conexão perdida. Reconectando...</p>
            )}
        </main>
    );
}

export default Communication;