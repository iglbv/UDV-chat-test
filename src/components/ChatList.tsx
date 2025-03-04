import { useState } from "react";
import { ChatRoom, User } from "../types";

interface ChatListProps {
    rooms: ChatRoom[];
    onSelectRoom: (room: ChatRoom) => void;
    onCreateRoom: (roomName: string) => void;
    onDeleteRoom: (roomId: string) => void;
    newRoomName: string;
    setNewRoomName: (name: string) => void;
    user: User | null;
    setRooms: (rooms: ChatRoom[]) => void;
}

const motivationalQuotes = [
    "Общение - это начало понимания.",
    "В диалоге рождается истина.",
    "Каждое сообщение - это шаг к сближению.",
    "Творите историю в каждом чате."
];

const emojis = ["😊", "🚀", "🌟", "💬", "🎉", "🤖", "💡", "👋"];

export const ChatList = ({
    rooms,
    onSelectRoom,
    onCreateRoom,
    onDeleteRoom,
    newRoomName,
    setNewRoomName,
    user,
}: ChatListProps) => {
    const [quote] = useState(() => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    const [emoji] = useState(() => emojis[Math.floor(Math.random() * emojis.length)]);
    const [searchQuery, setSearchQuery] = useState(""); // Состояние для поискового запроса

    // Функция для фильтрации чатов по названию
    const filteredRooms = rooms.filter((room) =>
        room.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateRoom = () => {
        if (newRoomName.trim()) {
            const roomNameExists = rooms.some((room) => room.name === newRoomName.trim());
            if (roomNameExists) {
                alert("Чат с таким названием уже существует.");
                return;
            }
            onCreateRoom(newRoomName.trim());
            setNewRoomName("");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length <= 30) {
            setNewRoomName(value);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value); // Обновляем поисковый запрос
    };

    return (
        <div className="chat-list-container">
            <div className="chat-list-content">
                <h2>UDV CHAT {emoji}</h2>
                <p className="chat-list-quote">
                    {quote}
                </p>
                <h3>Доступные чаты</h3>

                {/* Поле для поиска чатов */}
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Поиск чатов..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>

                {filteredRooms.length === 0 ? (
                    <p className="no-chats-message">Чатов не найдено.</p>
                ) : (
                    <ul className="chat-list">
                        {filteredRooms.map((room) => (
                            <li key={room.id} onClick={() => onSelectRoom(room)}>
                                <div className="chat-info">
                                    <div className="chat-avatar">
                                        <div className="default-avatar">{room.name[0]}</div>
                                    </div>
                                    <span>{room.name}</span>
                                </div>
                                {user && room.creatorId === user.id && (
                                    <button
                                        className="delete-chat-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteRoom(room.id);
                                        }}
                                    >
                                        Удалить
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}

                <div className="create-room">
                    <input
                        type="text"
                        placeholder="Название нового чата"
                        value={newRoomName}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleCreateRoom();
                            }
                        }}
                    />
                    <button onClick={handleCreateRoom}>Создать чат</button>
                    {newRoomName.length === 30 && (
                        <p className="input-warning">Достигнуто максимальное количество символов (30)</p>
                    )}
                </div>
            </div>
        </div>
    );
};