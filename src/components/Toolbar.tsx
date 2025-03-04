import { User } from "../types";

interface ToolbarProps {
    user: User | null;
    onLogoutClick: () => void;
    onTitleClick: () => void;
}

export const Toolbar = ({
    user,
    onLogoutClick,
    onTitleClick
}: ToolbarProps) => {
    return (
        <div className="toolbar">
            <div className="toolbar-title" onClick={onTitleClick}>
                UDV CHAT
            </div>
            {user && ( // Показываем только для авторизованных пользователей
                <>
                    <span className="toolbar-greeting">Привет, {user.name}!</span>
                    <button className="toolbar-logout-button" onClick={onLogoutClick}>
                        Выйти
                    </button>
                </>
            )}
        </div>
    );
};