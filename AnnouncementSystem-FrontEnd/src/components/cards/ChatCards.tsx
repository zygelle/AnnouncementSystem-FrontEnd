import {Chat} from "../../schema/ChatSchema.tsx";
import React, {useEffect, useState} from "react";
import {formatDateChat} from "../../utils/formatDateChat.tsx";
import {fetchFirstImage} from "../../services/firebase/fetchFirstImage.tsx";

interface ChatCardProps {
    chat: Chat;
    setSelectChat: (chat: Chat) => void;
}

const ChatCards: React.FC<ChatCardProps> = ({chat, setSelectChat})=> {

    const [imageSrc, setImageSrc] = useState('/images/img-padrao.PNG');

    useEffect(() => {
        const getImage = async () => {
            const url = await fetchFirstImage(chat.announcement.imageArchive);
            if (url) {
                setImageSrc(url);
            }
        };

        getImage().catch((error) => {
            console.error("Erro ao buscar imagem do anúncio: " + error)
        });
    }, [chat.announcement.imageArchive]);

    return (
        <div className={`flex items-center gap-4 m-1 p-1 hover:border-solid hover:border-2 hover:border-blue-300 hover:cursor-pointer ${
                chat.chatStatus === 'CLOSED' ? 'opacity-50' : ''}`}
             onClick={() => setSelectChat(chat)}>
            <div className="w-16 h-16 overflow-hidden rounded-full flex-shrink-0">
                <img
                    src={imageSrc}
                    alt="Imagem do Anúncio"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex flex-col justify-between flex-1">
                <div className="font-bold text-md">{chat.announcement.title}</div>
                <div className="text-sm text-gray-600">{chat.participant.name}</div>
            </div>
            {chat.dateLastMessage && (
                <div className="text-xs text-gray-500 text-end">
                    {formatDateChat(chat.dateLastMessage)}
                </div>
            )}
        </div>
    );
}

export default ChatCards;