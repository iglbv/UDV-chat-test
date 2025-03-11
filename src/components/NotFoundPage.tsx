/** @jsxImportSource @emotion/react */
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

const NotFoundContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;
    text-align: center;
    color: #333;
    padding: 1rem;
`;

const NotFoundHeader = styled.h1`
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: #2c3e50;
    font-weight: 700;
    transition: color 0.3s ease;

    &:hover {
        color: #1abc9c;
    }
`;

const NotFoundDescription = styled.p`
    font-size: 1rem;
    margin-bottom: 1.5rem;
    color: #7f8c8d;
    line-height: 1.5;
`;

const NotFoundButton = styled.button`
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #1abc9c, #16a085);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    &:active {
        transform: translateY(0);
    }
`;

export const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <NotFoundContainer>
            <NotFoundHeader>404 - Страница не найдена</NotFoundHeader>
            <NotFoundDescription>
                Извините, запрашиваемая страница не существует.
            </NotFoundDescription>
            <NotFoundButton onClick={() => navigate('/chatrooms')}>
                Вернуться на главную
            </NotFoundButton>
        </NotFoundContainer>
    );
};