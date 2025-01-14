import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Login } from '../pages/login/Login';
import '@testing-library/jest-dom';

import api from '../services/api/api';
jest.mock('../services/api/api');

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('../services/api/api');

describe('Login Component', () => {
    test('deve renderizar os campos de email, senha e o botão "Entrar"', () => {
        render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
        );

        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
    });

    test('deve exibir mensagem de erro ao falhar no login', async () => {
        (api.post as jest.Mock).mockRejectedValue(new Error('Erro no servidor'));

        render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'teste@teste.com' },
        });
        fireEvent.change(screen.getByLabelText(/senha/i), {
        target: { value: '123456' },
        });

        fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

        await waitFor(() => {
        expect(
            screen.getByText(/falha no login, tente novamente:/i)
        ).toBeInTheDocument();
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });
        
    test('deve realizar login com sucesso e redirecionar', async () => {
        (api.post as jest.Mock).mockResolvedValue({
        data: { token: 'token-falso' },
        });
    
        render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'teste@teste.com' },
        });
        fireEvent.change(screen.getByLabelText(/senha/i), {
        target: { value: '123456' },
        });
    

        fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    

        await waitFor(() => {
        expect(localStorage.getItem('email')).toBe('teste@teste.com');
        expect(localStorage.getItem('accessToken')).toBe('token-falso');
        
        expect(mockNavigate).toHaveBeenCalledWith('/'); 
        });
    });
});