import { User } from "../types";
import { Link } from 'react-router-dom';

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
            <Link to="/chatrooms" className="toolbar-title" onClick={onTitleClick}>
                UDV CHAT
            </Link>
            {user && (
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