import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import VisualizarAnuncio from '../pages/anuncio/VisualizarAnuncio';
import api from '../services/api/api.tsx';
import '@testing-library/jest-dom';

jest.mock('../services/api/api.tsx', () => ({
    get: jest.fn() as jest.Mock,
    post: jest.fn() as jest.Mock,
    delete: jest.fn() as jest.Mock,
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

const mockAd = {
    id: '123',
    title: 'Anúncio de Teste',
    content: 'Descrição do anúncio...',
    price: 100,
    city: { id: '1', name: 'São Paulo' },
    categories: [{ id: '1', name: 'Categoria Teste' }],
    author: { email: 'teste@teste.com', name: 'Autor Teste', score: 4.5, icon: '' },
    imageArchive: 'test-image',
    status: 'Aberto',
    date: '2025-01-01T12:00:00Z',
};

describe('VisualizarAnuncio Page', () => {

    beforeEach(() => {
        (api.get as jest.Mock).mockResolvedValue({ status: 200, data: mockAd });
    });

    test('deve renderizar o anúncio corretamente', async () => {
        render(
            <MemoryRouter initialEntries={['/anuncio/123']}>
                <VisualizarAnuncio />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Anúncio de Teste')).toBeInTheDocument();
            expect(screen.getByText('Descrição do anúncio...')).toBeInTheDocument();
            expect(screen.getByText('R$ 100,00')).toBeInTheDocument();
            expect(screen.getByText('São Paulo')).toBeInTheDocument();
        });
    });

    test('deve exibir erro caso não consiga buscar o anúncio', async () => {
        (api.get as jest.Mock).mockRejectedValueOnce(new Error('Erro ao buscar o anúncio'));

        render(
            <MemoryRouter initialEntries={['/anuncio/123']}>
                <VisualizarAnuncio />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Ops! Algo deu errado.')).toBeInTheDocument();
        });
    });

});





