/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { ChatRoom, User } from "../types";
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

interface ChatListProps {
    rooms: ChatRoom[];
    onCreateRoom: (roomName: string) => void;
    onDeleteRoom: (roomId: string) => void;
    newRoomName: string;
    setNewRoomName: (name: string) => void;
    user: User | null;
}

const motivationalQuotes = [
    "Общение - это начало понимания.",
    "В диалоге рождается истина.",
    "Каждое сообщение - это шаг к сближению.",
    "Творите историю в каждом чате."
];

const emojis = ["😊", "🚀", "🌟", "💬", "🎉", "🤖", "💡", "👋"];

const ChatListContainer = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    overflow: hidden;
    box-sizing: border-box;
`;

const ChatListContent = styled.div`
    background: white;
    padding: 1.5rem;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-sizing: border-box;
`;

const ChatListHeader = styled.h2`
    margin-bottom: 1rem;
    color: #2c3e50;
    font-size: 1.75rem;
    font-weight: 600;
    box-sizing: border-box;
`;

const ChatListQuote = styled.p`
    font-style: italic;
    font-size: 0.9rem;
    color: #7f8c8d;
    margin-top: -0.5rem;
    margin-bottom: 1.5rem;
    box-sizing: border-box;
`;

const SearchContainer = styled.div`
    margin-bottom: 1.5rem;
    width: 100%;
    box-sizing: border-box;
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 10px 16px;
    font-size: 0.9rem;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    outline: none;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    box-sizing: border-box;

    &:focus {
        border-color: #1abc9c;
        box-shadow: 0 0 8px rgba(26, 188, 156, 0.3);
    }

    &::placeholder {
        color: #999;
        font-style: italic;
    }
`;

const ChatListUl = styled.ul`
    list-style: none;
    padding: 0;
    margin-bottom: 1.5rem;
    max-height: 250px;
    overflow-y: auto;
    width: 100%;
    box-sizing: border-box;

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: #1abc9c;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #16a085;
    }
`;

const ChatListItem = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-sizing: border-box;

    &:hover {
        background-color: #f1f1f1;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
`;

const ChatInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    box-sizing: border-box;
`;

const ChatAvatar = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #1abc9c;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 0.9rem;
    font-weight: 600;
    box-sizing: border-box;
`;

const DeleteChatButton = styled.button`
    padding: 6px 12px;
    font-size: 0.8rem;
    background-color: #ff4d4d;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
    box-sizing: border-box;

    &:hover {
        background-color: #ff1a1a;
    }
`;

const CreateRoomContainer = styled.div`
    margin-top: 1.5rem;
    width: 100%;
    box-sizing: border-box;
`;

const CreateRoomInput = styled.input`
    width: 100%;
    padding: 10px 16px;
    margin-bottom: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    font-size: 0.9rem;
    transition: border-color 0.3s;
    box-sizing: border-box;

    &:focus {
        border-color: #1abc9c;
        outline: none;
    }
`;

const CreateRoomButton = styled.button`
    width: 100%;
    padding: 10px 16px;
    background-color: #1abc9c;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.3s;
    box-sizing: border-box;

    &:hover {
        background-color: #16a085;
    }
`;

const InputWarning = styled.p`
    color: #ff4d4d;
    font-size: 0.8rem;
    text-align: center;
    margin-top: 0.5rem;
    box-sizing: border-box;
`;

export const ChatList = ({
    rooms,
    onCreateRoom,
    onDeleteRoom,
    newRoomName,
    setNewRoomName,
    user,
}: ChatListProps) => {
    const [quote] = useState(() => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    const [emoji] = useState(() => emojis[Math.floor(Math.random() * emojis.length)]);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

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
        setSearchQuery(e.target.value);
    };

    const handleSelectRoom = (room: ChatRoom) => {
        navigate(`/room/${room.id}`);
    };

    return (
        <ChatListContainer>
            <ChatListContent>
                <ChatListHeader>UDV CHAT {emoji}</ChatListHeader>
                <ChatListQuote>{quote}</ChatListQuote>
                <h3>Доступные чаты</h3>
                <SearchContainer>
                    <SearchInput
                        type="text"
                        placeholder="Поиск чатов..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </SearchContainer>

                {filteredRooms.length === 0 ? (
                    <p className="no-chats-message">Чатов не найдено.</p>
                ) : (
                    <ChatListUl>
                        {filteredRooms.map((room) => (
                            <ChatListItem key={room.id} onClick={() => handleSelectRoom(room)}>
                                <ChatInfo>
                                    <ChatAvatar>{room.name[0]}</ChatAvatar>
                                    <span>{room.name}</span>
                                </ChatInfo>
                                {user && room.creatorId === user.id && (
                                    <DeleteChatButton
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteRoom(room.id);
                                        }}
                                    >
                                        Удалить
                                    </DeleteChatButton>
                                )}
                            </ChatListItem>
                        ))}
                    </ChatListUl>
                )}

                <CreateRoomContainer>
                    <CreateRoomInput
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
                    <CreateRoomButton onClick={handleCreateRoom}>Создать чат</CreateRoomButton>
                    {newRoomName.length === 30 && (
                        <InputWarning>Достигнуто максимальное количество символов (30)</InputWarning>
                    )}
                </CreateRoomContainer>
            </ChatListContent>
        </ChatListContainer>
    );
};