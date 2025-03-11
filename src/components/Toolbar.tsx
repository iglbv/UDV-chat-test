/** @jsxImportSource @emotion/react */
import { User } from "../types";
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

interface ToolbarProps {
    user: User | null;
    onLogoutClick: () => void;
    onTitleClick: () => void;
}

const ToolbarContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 70px;
    background: linear-gradient(135deg, #2c3e50, #34495e);
    color: white;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    transition: background-color 0.3s ease;

    &:hover {
        background: linear-gradient(135deg, #34495e, #2c3e50);
    }
`;

const ToolbarTitle = styled(Link)`
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    text-decoration: none;
    transition: color 0.3s ease, transform 0.2s ease;

    &:hover {
        color: #1abc9c;
        transform: translateY(-2px);
    }
`;

const ToolbarGreeting = styled.span`
    font-size: 1rem;
    color: #ecf0f1;
    margin-right: 1rem;
`;

const ToolbarLogoutButton = styled.button`
    background-color: #1abc9c;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: background-color 0.3s ease, transform 0.2s ease;

    &:hover {
        background-color: #16a085;
        transform: translateY(-2px);
    }

    &:active {
        transform: translateY(0);
    }
`;

export const Toolbar = ({
    user,
    onLogoutClick,
    onTitleClick
}: ToolbarProps) => {
    return (
        <ToolbarContainer>
            <ToolbarTitle to="/chatrooms" onClick={onTitleClick}>
                UDV CHAT
            </ToolbarTitle>
            {user && (
                <>
                    <ToolbarGreeting>Привет, {user.name}!</ToolbarGreeting>
                    <ToolbarLogoutButton onClick={onLogoutClick}>
                        Выйти
                    </ToolbarLogoutButton>
                </>
            )}
        </ToolbarContainer>
    );
};