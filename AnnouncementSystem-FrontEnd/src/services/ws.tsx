import { Client } from '@stomp/stompjs';

// Estrutura da mensagem recebida do servidor (SendMessageDTO)
export interface ChatMessage {
    id: string;
    date: string;
    sender: {
        email: string;
        name: string;
    };
    status: string;
    message: string;
}

// Configuração do WebSocket sem SockJS
const connectWebSocket = (
    token: string,
    onMessageReceived: (message: ChatMessage) => void
): Client => {
    const client = new Client({
        brokerURL: 'ws://localhost:8080/ws', // URL do WebSocket
        connectHeaders: {
            Authorization: `Bearer ${token}`, // Cabeçalho de autenticação JWT
        },
        debug: (str) => console.log(str), // Log para depuração
        reconnectDelay: 5000, // Reconexão automática após 5 segundos
        onConnect: () => {
            console.log('WebSocket conectado!');
            client.subscribe('/topic/chat', (message) => {
                // Processa a mensagem recebida do servidor
                onMessageReceived(JSON.parse(message.body));
            });
        },
        onStompError: (error) => {
            console.error('Erro no WebSocket:', error);
        },
    });

    client.activate(); // Ativa o cliente WebSocket

    return client; // Retorna o cliente WebSocket para uso posterior
};

export default connectWebSocket;

