import { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import connectWebSocket, { ChatMessage } from '../../services/ws';
import {getToken} from "../../services/token.tsx";

function Communication() {
    const [messages, setMessages] = useState<ChatMessage[]>([]); // Estado para mensagens recebidas
    const [newMessage, setNewMessage] = useState<string>(''); // Estado para nova mensagem
    const [stompClient, setStompClient] = useState<Client | null>(null); // Cliente WebSocket
    const chatId = '6e41c98b-0c13-4bae-942d-710efa65986c'; // Substitua pelo ID real do chat
    const token:string = getToken() || ""; // Substitua pelo token JWT real do usuário

    useEffect(() => {
        const client = connectWebSocket(token, (message: ChatMessage) => {
            setMessages((prevMessages) => [...prevMessages, message]); // Atualiza o estado com nova mensagem
        });

        setStompClient(client);

        return () => {
            client.deactivate(); // Desativa o WebSocket ao desmontar o componente
        };
    }, [token]);

    const sendMessage = () => {
        if (newMessage.trim() && stompClient) {
            // Cria o DTO para envio
            const messageDTO = {
                chat: chatId,
                message: newMessage,
            };

            stompClient.publish({
                destination: '/app/chat/send', // Endpoint para envio de mensagens
                body: JSON.stringify(messageDTO), // Converte o DTO para JSON
            });

            setNewMessage(''); // Limpa o campo de entrada após envio
        }
    };

    return (
        <main>
            <h1>Chat</h1>
            {/* Lista de mensagens */}
            <div
                style={{
                    border: '1px solid #ddd',
                    padding: '10px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                }}
            >
                {messages.map((msg) => (
                    <div key={msg.id}>
                        <strong>{msg.sender.name}: </strong>
                        <span>{msg.message}</span>
                        <br />
                        <small>{new Date(msg.date).toLocaleString()}</small>
                    </div>
                ))}
            </div>
            {/* Entrada de texto para nova mensagem */}
            <div>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                />
                <button onClick={sendMessage}>Enviar</button>
            </div>
        </main>
    );
}

export default Communication;
