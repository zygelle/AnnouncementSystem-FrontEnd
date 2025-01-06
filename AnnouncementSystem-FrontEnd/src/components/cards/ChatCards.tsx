import {Chat} from "../../schema/ChatSchema.tsx";
import React, {useEffect, useState} from "react";
import {getDownloadURL, listAll, ref} from "firebase/storage";
import {storage} from "../../services/firebaseConfig.tsx";

interface ChatCardProps {
    chat: Chat;
    setSelectChat: (chat: Chat) => void;
}

const ChatCards: React.FC<ChatCardProps> = ({chat, setSelectChat})=> {

    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        };
        return new Date(date).toLocaleDateString('pt-BR', options);
    };

    const [imageSrc, setImageSrc] = useState('/images/img-padrao.PNG');

    useEffect(() => {
        fetchImages(chat.announcement.imageArchive)
    }, []);

    const fetchImages = (id: string | null | undefined) => {
        if (!chat.announcement.imageArchive) {
            return;
        }
        const imageListRef = ref(storage, `${id}/`);
        listAll(imageListRef).then((response) => {
            if (response.items.length > 0) {
                getDownloadURL(response.items[0]).then((url) => {
                    setImageSrc(url);
                });
            } else {
                console.log("Nenhuma imagem encontrada.");
            }
        }).catch(error => {
            console.error("Erro ao buscar as imagens:", error);
        });
    };

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
                    {formatDate(chat.dateLastMessage)}
                </div>
            )}
        </div>
    );
}

export default ChatCards;