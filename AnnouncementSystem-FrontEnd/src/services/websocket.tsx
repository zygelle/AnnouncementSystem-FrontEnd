import { Client, IMessage } from '@stomp/stompjs';

let stompClient: Client | null = null;

export const connectWebSocket = (token: string | null, onMessageReceived: (message: any) => void): void => {
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
            onDisconnect: () => {
                console.log('Desconectado do WebSocket');
            },
            // debug: (str: string) => console.log(str),
        });

        stompClient.activate();

    }else{
        // console.log("Token Null")
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
        stompClient.deactivate();
        stompClient = null;
    }
};
