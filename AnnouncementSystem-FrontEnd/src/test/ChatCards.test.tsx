import { render, screen, fireEvent } from '@testing-library/react';
import ChatCards from '../components/cards/ChatCards';
import { Chat } from "../schema/ChatSchema.tsx";
import '@testing-library/jest-dom';

jest.mock("../services/firebase/fetchFirstImage.tsx", () => ({
    fetchFirstImage: jest.fn().mockResolvedValue('/images/test-image.jpg'),
}));

const mockChat: Chat = {
    id: '123',
    announcement: {
        id: "125",
        title: "Anúncio Teste",
        imageArchive: 'some-image-url',
        status: "Visível",
    },
    participant: { name: 'Participante Teste', email: 'teste@teste.com' },
    chatStatus: 'OPEN',
    isEvaluated: false,
    dateLastMessage: "2025-01-10T12:00:00Z"
};

describe('ChatCards Component', () => {

    test('deve renderizar o título do anúncio e o nome do participante', () => {
        render(
            <ChatCards
                chat={mockChat}
                setSelectChat={() => {}}
            />
        );

        expect(screen.getByText('Anúncio Teste')).toBeInTheDocument();
        expect(screen.getByText('Participante Teste')).toBeInTheDocument();
    });

    test('deve renderizar a imagem do anúncio', async () => {
        render(
            <ChatCards
                chat={mockChat}
                setSelectChat={() => {}}
            />
        );

        const img = await screen.findByAltText('Imagem do Anúncio');

        expect(img).toHaveAttribute('src', '/images/test-image.jpg');
    });

    test('deve exibir a data da última mensagem', () => {
        render(
            <ChatCards
                chat={mockChat}
                setSelectChat={() => {}}
            />
        );

        const dateText = screen.getByText(/10 de jan. de 2025, 09:00/);
        expect(dateText).toBeInTheDocument();
    });

    test('deve chamar setSelectChat ao clicar no card', () => {
        const setSelectChatMock = jest.fn();

        render(
            <ChatCards
                chat={mockChat}
                setSelectChat={setSelectChatMock}
            />
        );

        const chatCard = screen.getByText('Anúncio Teste');
        fireEvent.click(chatCard);

        expect(setSelectChatMock).toHaveBeenCalledWith(mockChat);
    });

});

