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

    const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

    return (
        <div className="chat-list-container">
            <div className="chat-list-content">
                <h2>UDV CHAT {emoji}</h2>
                <p className="chat-list-quote">
                    {quote}
                </p>
                <h3>Доступные чаты</h3>
                {rooms.length === 0 ? (
                    <p className="no-chats-message">На данный момент нет созданных чатов.</p>
                ) : (
                    <ul className="chat-list">
                        {rooms.map((room) => (
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
                        onChange={(e) => setNewRoomName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleCreateRoom();
                            }
                        }}
                    />
                    <button onClick={handleCreateRoom}>Создать чат</button>
                </div>
            </div>
        </div>
    );
};