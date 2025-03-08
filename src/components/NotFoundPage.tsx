import React from 'react';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found-container">
            <h1>404 - Страница не найдена</h1>
            <p>Извините, запрашиваемая страница не существует.</p>
            <button onClick={() => navigate('/chatrooms')}>Вернуться на главную</button>
        </div>
    );
};