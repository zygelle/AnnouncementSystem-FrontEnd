import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

import { EditarAnuncio } from '../pages/anuncio/EditarAnuncio';
import { loadCities } from '../utils/loadCities';
import { loadCategories } from '../utils/loadCategories';
import { handleUpload } from '../services/firebase/handleUpload';
import api from '../services/api/api';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '123' }),
}));

jest.mock('../utils/loadCities', () => ({
    __esModule: true,
    loadCities: jest.fn(),
}));
jest.mock('../utils/loadCategories', () => ({
    __esModule: true,
    loadCategories: jest.fn(),
}));
jest.mock('../services/firebase/handleUpload', () => ({
    __esModule: true,
    handleUpload: jest.fn(),
}));
jest.mock('../services/api/api', () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
        post: jest.fn(),
    },
}));

describe('EditarAnuncio Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockNavigate.mockReset();

        (loadCities as jest.Mock).mockImplementation(async (setCityOptions) => {
            setCityOptions([
                { id: '1', name: 'Niterói' },
                { id: '2', name: 'Rio de Janeiro' },
            ]);
        });
        (loadCategories as jest.Mock).mockImplementation(async (setCategoryOptions) => {
            setCategoryOptions([
                { id: '10', name: 'Eletrônicos' },
                { id: '20', name: 'Móveis' },
            ]);
        });

        (handleUpload as jest.Mock).mockResolvedValue('https://fakeurl.com/imagem.jpg');
    });

    test('deve carregar dados existentes do anúncio e editar com sucesso', async () => {
        (api.get as jest.Mock).mockResolvedValueOnce({
            data: {
                id: '123',
                title: 'Título original',
                content: 'Conteúdo original',
                price: 100,
                date: '2025-01-10T12:00:00Z',
                status: 'Visível',
                author: {
                    email: 'author@example.com',
                    name: 'Nome do Autor',
                    score: 0
                },
                city: { id: '1', name: 'Niterói' },
                categories: [{ id: '10', name: 'Eletrônicos' }],
                imageArchive: '',
            },
        });

        (api.post as jest.Mock).mockResolvedValueOnce({
            data: {
                id: '123',
                title: 'Título Editado',
                content: 'Conteúdo Editado',
                price: 150,
                date: '2025-01-10T12:00:00Z',
                status: 'Visível',
                author: {
                    email: 'author@example.com',
                    name: 'Nome do Autor',
                    score: 0
                },
                city: { id: '1', name: 'Niterói' },
                categories: [{ id: '10', name: 'Eletrônicos' }],
                imageArchive: '',
            }
        });

        render(
            <BrowserRouter>
                <EditarAnuncio />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(loadCities).toHaveBeenCalled();
            expect(loadCategories).toHaveBeenCalled();
            expect(api.get).toHaveBeenCalledWith('/announcement/123');
        });

        const titleInput = await screen.findByDisplayValue('Título original');
        expect(titleInput).toBeInTheDocument();
        expect(screen.getByDisplayValue('Conteúdo original')).toBeInTheDocument();
        expect(screen.getByDisplayValue('100')).toBeInTheDocument();

        await userEvent.clear(screen.getByDisplayValue('Título original'));
        await userEvent.type(screen.getByPlaceholderText('Título'), 'Título Editado');

        await userEvent.clear(screen.getByDisplayValue('100'));
        await userEvent.type(screen.getByPlaceholderText('0.0'), '150');

        await userEvent.click(screen.getByRole('button', { name: /editar/i }));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith(
                '/announcement/edit/123',
                expect.objectContaining({
                title: 'Título Editado',
                content: 'Conteúdo original',
                city: '1',
                categories: ['10'],
                })
            );
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/anuncio/123');
        });
    });

    test('deve exibir erro no console se não carregar dados do anúncio', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        (api.get as jest.Mock).mockRejectedValueOnce(new Error('Erro ao carregar'));

        render(
            <BrowserRouter>
                <EditarAnuncio />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Erro ao carregar os dados do anúncio:',
                expect.any(Error)
            );
        });

        consoleErrorSpy.mockRestore();
    });

    test('deve exibir erro no console se falhar ao editar', async () => {
        (api.get as jest.Mock).mockResolvedValueOnce({
            data: {
                id: '123',
                title: 'Título original',
                content: 'Conteúdo original',
                price: 100,
                date: '2025-01-10T12:00:00Z',
                status: 'Visível',
                author: { email: 'autor@teste.com', name: 'Autor', score: 0 },
                city: { id: '1', name: 'Niterói' },
                categories: [{ id: '10', name: 'Eletrônicos' }],
                imageArchive: '',
            },
        });

        (api.post as jest.Mock).mockRejectedValueOnce(new Error('Erro ao editar'));

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(
            <BrowserRouter>
                <EditarAnuncio />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('/announcement/123');
        });

        await userEvent.click(screen.getByRole('button', { name: /editar/i }));

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Erro ao editar anúncio:',
                expect.any(Error)
            );
        });

        consoleErrorSpy.mockRestore();
    });
});