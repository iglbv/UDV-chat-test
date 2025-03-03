import { useState } from "react";

interface LoginFormProps {
    onLogin: (userName: string) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
    const [userName, setUserName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(userName);
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
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                    <button type="submit">Войти</button>
                </form>
            </div>
        </div>
    );
};