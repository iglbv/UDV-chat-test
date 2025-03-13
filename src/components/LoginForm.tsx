/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

interface LoginFormProps {
    onLogin: (userName: string) => void;
}

const LoginContainer = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
`;

const LoginFormContainer = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }
`;

const LoginHeader = styled.h2`
    margin-bottom: 1rem;
    color: #2c3e50;
    font-size: 1.8rem;
    font-weight: 600;
`;

const LoginDescription = styled.p`
    margin-bottom: 1.5rem;
    color: #7f8c8d;
    font-size: 1rem;
    line-height: 1.5;
`;

const LoginInput = styled.input`
    width: 100%;
    padding: 12px 16px;
    margin-bottom: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    font-size: 1rem;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    box-sizing: border-box;

    &:focus {
        border-color: #1abc9c;
        box-shadow: 0 0 8px rgba(26, 188, 156, 0.3);
        outline: none;
    }

    &::placeholder {
        color: #999;
        font-style: italic;
    }
`;

const LoginButton = styled.button`
    width: 100%;
    padding: 12px 16px;
    background-color: #1abc9c;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;

    &:hover {
        background-color: #16a085;
        transform: translateY(-2px);
    }

    &:active {
        transform: translateY(0);
    }
`;

const InputWarning = styled.p`
    color: #ff4d4d;
    font-size: 0.875rem;
    text-align: center;
    margin-top: 0.5rem;
`;

export const LoginForm = ({ onLogin }: LoginFormProps) => {
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userName.trim().length > 20) {
            alert("Имя пользователя не должно превышать 20 символов.");
            return;
        }
        onLogin(userName.trim());
        navigate("/");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length <= 20) {
            setUserName(value);
        }
    };

    return (
        <LoginContainer>
            <LoginFormContainer>
                <LoginHeader>Добро пожаловать в RTF CHAT!</LoginHeader>
                <LoginDescription>
                    Пожалуйста, войдите в систему, чтобы начать общение.
                </LoginDescription>
                <form onSubmit={handleSubmit}>
                    <LoginInput
                        type="text"
                        placeholder="Ваше имя"
                        value={userName}
                        onChange={handleInputChange}
                        required
                    />
                    <LoginButton type="submit">Войти</LoginButton>
                    {userName.length === 20 && (
                        <InputWarning>Достигнуто максимальное количество символов (20)</InputWarning>
                    )}
                </form>
            </LoginFormContainer>
        </LoginContainer>
    );
};