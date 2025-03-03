import { User } from "../types";

interface ToolbarProps {
    user: User | null;
    onLoginClick: () => void;
    onLogoutClick: () => void;
}

export const Toolbar = ({ user, onLoginClick, onLogoutClick }: ToolbarProps) => {
    return (
        <div className="toolbar">
            <div className="toolbar-title">UDV CHAT</div>
            {user ? (
                <>
                    <span className="toolbar-greeting">Привет, {user.name}!</span>
                    <button className="toolbar-logout-button" onClick={onLogoutClick}>
                        Выйти
                    </button>
                </>
            ) : (
                <button className="toolbar-login-button" onClick={onLoginClick}>
                    Войти
                </button>
            )}
        </div>
    );
};

