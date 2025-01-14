import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { BrowserRouter } from 'react-router-dom';
import { CriarAnuncio } from '../pages/anuncio/CriarAnuncio';

import '@testing-library/jest-dom';

import { loadCities } from '../utils/loadCities';
import { loadCategories } from '../utils/loadCategories';
import { handleUpload } from '../services/firebase/handleUpload';
import api from '../services/api/api';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
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
        post: jest.fn(),
    },
}));

describe('CriarAnuncio Component', () => {
    beforeAll(() => {
        global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/fake');
    });

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

    test('deve preencher o formulário e criar um anúncio com sucesso', async () => {
        (api.post as jest.Mock).mockResolvedValueOnce({
            data: {
                id: '123',
                title: 'Título do Anúncio',
                content: 'Texto descritivo do anúncio...',
                price: 99.9,
                date: '2025-01-10T12:00:00Z',
                status: 'Visível',
                author: {
                    email: 'author@example.com',
                    name: 'Nome do Autor',
                    score: 0
                },
                city: {
                    id: '1',
                    name: 'Niterói',
                },
                categories: [
                    {
                    id: '10',
                    name: 'Eletrônicos',
                    },
                ],
                imageArchive: 'https://fakeurl.com/imagem.jpg',
            },
        });

        render(
            <BrowserRouter>
                <CriarAnuncio />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(loadCities).toHaveBeenCalled();
            expect(loadCategories).toHaveBeenCalled();
        });

        await userEvent.type(
            screen.getByLabelText('Título'),
            'Meu Novo Anúncio'
        );

        await userEvent.type(
            screen.getByLabelText('Descrição do Anúncio'),
            'Uma descrição bem detalhada'
        );

        const cityCombo = screen.getByRole('combobox', { name: /localização/i });
        await userEvent.click(cityCombo);
        await userEvent.click(screen.getByText('Niterói'));


        const categoryCombo = screen.getByRole('combobox', { name: /categorias/i });
        await userEvent.click(categoryCombo);
        await userEvent.click(screen.getByText('Eletrônicos'));

        await userEvent.type(screen.getByLabelText('Preço (R$)'), '123.45');

        await userEvent.click(screen.getByRole('button', { name: /Anunciar/i }));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('announcement/create', {
                title: 'Meu Novo Anúncio',
                content: 'Uma descrição bem detalhada',
                price: 123.45,
                city: '1', // Observação: depends on how we mapped the value do ID
                categories: ['10'], // Se "Eletrônicos" é ID=10
                imageArchive: '',   // Se isImages = false ou images.length=0
            });
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/anuncio/123');
        });
    });

    test('deve preencher o formulário, fazer upload de imagem e criar um anúncio com sucesso', async () => {
        (api.post as jest.Mock).mockResolvedValueOnce({
            data: {
                id: '123',
                title: 'Título do Anúncio',
                content: 'Texto descritivo do anúncio...',
                price: 99.9,
                date: '2025-01-10T12:00:00Z',
                status: 'Visível',
                author: {
                    email: 'author@example.com',
                    name: 'Nome do Autor',
                    score: 0,
                },
                city: {
                    id: '1',
                    name: 'Niterói',
                },
                categories: [
                    {
                        id: '10',
                        name: 'Eletrônicos',
                    },
                ],
                imageArchive: 'https://fakeurl.com/imagem.jpg',
            },
        });
    
        render(
            <BrowserRouter>
                <CriarAnuncio />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(loadCities).toHaveBeenCalled();
            expect(loadCategories).toHaveBeenCalled();
        });

        await userEvent.type(screen.getByLabelText('Título'), 'Meu Novo Anúncio');

        await userEvent.type(screen.getByLabelText('Descrição do Anúncio'), 'Uma descrição bem detalhada');

        const cityCombo = screen.getByRole('combobox', { name: /localização/i });
        await userEvent.click(cityCombo);
        await userEvent.click(screen.getByText('Niterói'));

        const categoryCombo = screen.getByRole('combobox', { name: /categorias/i });
        await userEvent.click(categoryCombo);
        await userEvent.click(screen.getByText('Eletrônicos'));

        await userEvent.type(screen.getByLabelText('Preço (R$)'), '123.45');

        const fileInput = screen.getByTestId('photo-upload-input');
        const testFile = new File(['arquivo-fake'], 'teste.jpg', { type: 'image/jpeg' });
        await userEvent.upload(fileInput, testFile);

        expect(fileInput.files).toHaveLength(1);
        expect(fileInput.files?.[0].name).toBe('teste.jpg');

        await userEvent.click(screen.getByRole('button', { name: /Anunciar/i }));

        await waitFor(() => {
            expect(handleUpload).toHaveBeenCalledTimes(1);

            const callArgs = (handleUpload as jest.Mock).mock.calls[0];
            const uploadedFiles = callArgs[0];
            const fileNameGenerated = callArgs[1];
    
            expect(uploadedFiles).toHaveLength(1);
            expect(uploadedFiles[0].name).toBe('teste.jpg');
            expect(fileNameGenerated).toEqual(expect.any(String));
    
            expect(api.post).toHaveBeenCalledWith('announcement/create', {
                title: 'Meu Novo Anúncio',
                content: 'Uma descrição bem detalhada',
                price: 123.45,
                city: '1',
                categories: ['10'],
                imageArchive: 'https://fakeurl.com/imagem.jpg',
            });
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/anuncio/123');
        });
    });

    test('deve exibir alerta de erro se a API falhar', async () => {
        (api.post as jest.Mock).mockRejectedValue(new Error('Erro de servidor'));

        const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

        render(
            <BrowserRouter>
                <CriarAnuncio />
            </BrowserRouter>
        );

        await userEvent.type(
            screen.getByLabelText(/título/i),
            'Título do teste'
        );

        await userEvent.type(
            screen.getByLabelText(/descrição do anúncio/i),
            'Descrição teste'
        );

        await userEvent.clear(screen.getByLabelText(/preço \(r\$\)/i)); // limpa o default "0"
        await userEvent.type(
            screen.getByLabelText(/preço \(r\$\)/i),
            '10'
        );

        const cityCombo = screen.getByText('Selecione a cidade');
        await userEvent.click(cityCombo); 
        await userEvent.click(screen.getByText('Niterói'));

        const categoryCombo = screen.getByText('Selecione as categorias');
        await userEvent.click(categoryCombo);
        await userEvent.click(screen.getByText('Eletrônicos'));

        await userEvent.click(screen.getByRole('button', { name: /anunciar/i }));

        await waitFor(() => {
            expect(mockAlert).toHaveBeenCalledWith('Erro ao criar anúncio');
            expect(mockNavigate).not.toHaveBeenCalled();
        });

        mockAlert.mockRestore();
    });
});