import { Client, IMessage } from '@stomp/stompjs';

let stompClient: Client | null = null;

/**
 * Inicializa a conexão com o WebSocket.
 * @param {string} token - O token de autenticação JWT.
 * @param {(message: any) => void} onMessageReceived - Callback para tratar mensagens recebidas.
 */
export const connectWebSocket = (token: string | null, onMessageReceived: (message: any) => void): void => {
    if (token){
        console.log("Token: " + token)
        stompClient = new Client({
            brokerURL: `ws://localhost:8080/ws/chat?token=${token}`, // URL do endpoint WebSocket
            onConnect: () => {
                console.log('Conectado ao WebSocket');

                // Inscrevendo-se para receber mensagens no destino "/queue/messages"
                stompClient?.subscribe('/user/queue/messages', (message: IMessage) => {
                    console.log('Mensagem recebida do WebSocket:', message.body);
                    if (message.body) {
                        onMessageReceived(JSON.parse(message.body));
                    }
                });
            },
            onDisconnect: () => {
                console.log('Desconectado do WebSocket');
            },
            debug: (str: string) => console.log(str), // Logs de debug
        });

        stompClient.activate();

    }else{
        console.log("Token Null")
    }
};

/**
 * Envia uma mensagem para o servidor.
 * @param {Object} message - A mensagem a ser enviada.
 */
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

/**
 * Desconecta do WebSocket.
 */
export const disconnectWebSocket = (): void => {
    if (stompClient) {
        stompClient.deactivate();
        stompClient = null;
    }
};
