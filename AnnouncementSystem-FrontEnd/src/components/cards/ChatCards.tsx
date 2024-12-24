import {Chat} from "../../schema/ChatSchema.tsx";
import React from "react";

interface ChatCardProps {
    chat: Chat
}

const ChatCards: React.FC<ChatCardProps> = ({chat})=> {
    return (
        <div>
            {chat.participant.name}
        </div>
    );
}

export default ChatCards;