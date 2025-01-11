import { render, screen} from '@testing-library/react';
import { Chat } from "../schema/ChatSchema.tsx";
import TalkCards from "../components/cards/TalkCards.tsx";
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';


const mockChat: Chat = {
    id: '123',
    announcement: {
        id: "125",
        title: "Anúncio",
        imageArchive: "",
        status: "Visível",
    },
    participant: { name: 'Participante Teste', email: 'teste@teste.com' },
    chatStatus: 'OPEN',
    isEvaluated: false,
    dateLastMessage: ""
};

describe('TalkCards Component', () => {

    test('deve renderizar o título do anúncio e o nome do participante', () => {
        render(
            <BrowserRouter>
                <TalkCards
                    chat={mockChat}
                    setChat={() => {}}
                    removeChatById={() => {}}
                    addChatToStart={() => {}}
                    setChatListVisible={() => {}}
                    isChatListVisible={false}
                    isMdOrLarger={false}
                />
            </BrowserRouter>
        );

        expect(screen.getByText('Anúncio')).toBeInTheDocument();
        expect(screen.getByText('Participante Teste')).toBeInTheDocument();
    });

});



