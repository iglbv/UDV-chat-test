import { ChatRoom } from "../types";

interface ChatListProps {
    rooms: ChatRoom[];
    onSelectRoom: (room: ChatRoom) => void;
    onCreateRoom: (roomName: string) => void;
    onDeleteRoom: (roomId: string) => void;
    newRoomName: string;
    setNewRoomName: (name: string) => void;
}

export const ChatList = ({
    rooms,
    onSelectRoom,
    onCreateRoom,
    onDeleteRoom,
    newRoomName,
    setNewRoomName,
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

    return (
        <div className="chat-list-container">
            <div className="chat-list-content">
                <h2>UDV CHAT</h2>
                <h3>Доступные чаты</h3>
                {rooms.length === 0 ? (
                    <p className="no-chats-message">На данный момент нет созданных чатов.</p>
                ) : (
                    <ul className="chat-list">
                        {rooms.map((room) => (
                            <li key={room.id} onClick={() => onSelectRoom(room)}>
                                <span>{room.name}</span>
                                <button
                                    className="delete-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteRoom(room.id);
                                    }}
                                >
                                    Удалить
                                </button>
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