import { useState } from "react";
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
    onLogin: (userName: string) => void;
}

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
        <div className="login-container">
            <div className="login-form">
                <h2>Добро пожаловать в UDV CHAT!</h2>
                <p>Пожалуйста, войдите в систему, чтобы начать общение.</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Ваше имя"
                        value={userName}
                        onChange={handleInputChange}
                        required
                    />
                    <button type="submit">Войти</button>
                    {userName.length === 20 && (
                        <p className="input-warning">Достигнуто максимальное количество символов (20)</p>
                    )}
                </form>
            </div>
        </div>
    );
};