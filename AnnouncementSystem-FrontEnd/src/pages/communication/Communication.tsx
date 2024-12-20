import { useEffect, useState } from 'react';
import { connectWebSocket, disconnectWebSocket, sendMessage } from '../../services/websocket.tsx';
import { receiveMessageSchema, sendMessageSchema } from '../../schema/ChatSchema.tsx';
import { getToken } from '../../services/token.tsx';

// Define o tipo das mensagens recebidas
type Message = {
    id: string;
    content: string;
    sender: {
        email: string;
        name: string;
    };
    date: string;
};

function Communication() {
    const [messages, setMessages] = useState<Message[]>([]); // Define explicitamente o tipo
    const [newMessage, setNewMessage] = useState<string>('');
    const token = getToken(); // Substitua pelo token real

    useEffect(() => {
        // Função chamada ao receber uma nova mensagem
        const handleMessage = (message: unknown) => {
            try {
                const validatedMessage = receiveMessageSchema.parse(message); // Valida com o Zod
                setMessages((prev: Message[]) => [...prev, validatedMessage]); // Adiciona ao estado
            } catch (error) {
                console.error('Erro ao validar mensagem recebida:', error);
            }
        };

        // Conectar ao WebSocket
        connectWebSocket(token, handleMessage);

        return () => {
            // Desconectar ao desmontar o componente
            disconnectWebSocket();
        };
    }, [token]);

    const handleSendMessage = () => {
        try {
            const message = sendMessageSchema.parse({
                chat: '6e41c98b-0c13-4bae-942d-710efa65986c', // Substitua pelo ID real do chat
                message: newMessage,
            });
            sendMessage(message);
            setNewMessage('');
        } catch (error) {
            console.error('Erro ao validar mensagem para envio:', error);
        }
    };

    return (
        <main>
            <h1>Comunicação</h1>
            <div>
                <ul>
                    {messages.map((msg) => (
                        <li key={msg.id}>
                            <strong>{msg.sender.name}:</strong> {msg.content}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua mensagem"
                />
                <button onClick={handleSendMessage}>Enviar</button>
            </div>
        </main>
    );
}

export default Communication;

