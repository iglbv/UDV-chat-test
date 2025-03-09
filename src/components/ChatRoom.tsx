import { MessageList } from "./MessageList";
import { ChatRoom as ChatRoomType, Message } from "../types";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useStorage } from "../providers/StorageProvider";

interface ChatRoomProps {
    userId: string;
    userName: string;
    onLogout: () => void;
}

export const ChatRoom = ({
    userId,
    userName,
    onLogout,
}: ChatRoomProps) => {
    const { roomId } = useParams<{ roomId: string }>();
    const [room, setRoom] = useState<ChatRoomType | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const navigate = useNavigate();
    const { rooms, saveRooms } = useStorage();

    useEffect(() => {
        const currentRoom = rooms.find(r => r.id === roomId);
        if (currentRoom) {
            setRoom(currentRoom);
            setMessages(currentRoom.messages);
        } else {
            navigate("/chatrooms");
        }
    }, [roomId, navigate, rooms]);

    useEffect(() => {
        const interval = setInterval(() => {
            const currentRoom = rooms.find(r => r.id === roomId);
            if (currentRoom) {
                setMessages(currentRoom.messages);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [roomId, rooms]);

    const updateMessages = (newMessages: Message[]) => {
        if (!room) return;

        const updatedRoom = { ...room, messages: newMessages };
        const updatedRooms = rooms.map(r => r.id === room.id ? updatedRoom : r);
        saveRooms(updatedRooms);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() || selectedFile) {
            let mediaUrl: string | undefined;

            if (selectedFile) {
                mediaUrl = URL.createObjectURL(selectedFile);
            }

            const message: Message = {
                id: Date.now().toString(),
                text: newMessage,
                userId,
                userName,
                timestamp: Date.now(),
                replyTo: replyToMessage ? replyToMessage.id : undefined,
                mediaUrl: mediaUrl,
            };

            const updatedMessages = [...messages, message];
            updateMessages(updatedMessages);

            setNewMessage("");
            setReplyToMessage(null);
            setSelectedFile(null);
        }
    };

    const handleDeleteMessage = (messageId: string) => {
        const updatedMessages = messages.filter(message => message.id !== messageId);
        updateMessages(updatedMessages);
    };

    const handleReply = (message: Message) => {
        setReplyToMessage(message);
        setNewMessage(`@${message.userName}: `);
    };

    if (!room) {
        return null;
    }

    return (
        <div className="chat-room">
            <div className="chat-header">
                <div className="room-avatar">
                    <div className="default-avatar">{room.name[0]}</div>
                </div>
                <h2>Комната: {room.name}</h2>
                <div>
                    <div className="user-avatar">
                        <div className="default-avatar">{userName[0]}</div>
                    </div>
                    <span>Пользователь: {userName}</span>
                    <button className="logout-button" onClick={onLogout}>
                        Выйти из чата
                    </button>
                </div>
            </div>

            {replyToMessage && (
                <div className="replying-to">
                    Ответ пользователю {replyToMessage.userName}: {replyToMessage.text}
                    <button onClick={() => setReplyToMessage(null)}>Отмена</button>
                </div>
            )}

            <MessageList
                messages={messages}
                onReply={handleReply}
                onDeleteMessage={handleDeleteMessage}
                currentUserId={userId}
                onUpdateMessages={updateMessages}
            />

            <div className="message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSendMessage();
                        }
                    }}
                    placeholder="Введите сообщение"
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <button onClick={handleSendMessage}>Отправить</button>
            </div>
        </div>
    );
};