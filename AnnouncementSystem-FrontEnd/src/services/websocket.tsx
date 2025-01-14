import { Client, IMessage } from '@stomp/stompjs';
import {receiveMessage} from "../schema/ReceiveMessageSchema.tsx";

let stompClient: Client | null = null;

export const connectWebSocket = (token: string | null, onMessageReceived: (message: receiveMessage) => void): void => {
    if (token){
        stompClient = new Client({
            brokerURL: `ws://localhost:8080/ws/chat?token=${token}`, // URL do endpoint WebSocket
            onConnect: () => {
                stompClient?.subscribe('/user/queue/messages', (message: IMessage) => {
                    if (message.body) {
                        onMessageReceived(JSON.parse(message.body));
                    }
                });
            },
            onDisconnect: () => {},
        });

        stompClient.activate();

    }
};

export const sendMessage = (message: object): void => {
    if (stompClient && stompClient.connected) {
        stompClient.publish({
            destination: '/app/send-message', // Destino do mapeamento STOMP
            body: JSON.stringify(message),
        });
    } else {
        console.error('WebSocket não está conectado');
    }
};

export const disconnectWebSocket = (): void => {
    if (stompClient) {
        stompClient.deactivate().catch((error) => {
            console.error("Erro ao desativar: " + error)
        });
        stompClient = null;
    }
};
