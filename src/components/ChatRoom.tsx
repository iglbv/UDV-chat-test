import { MessageList } from "./MessageList";
import { ChatRoom as ChatRoomType, Message } from "../types";
import { saveChatRooms, loadChatRooms } from "../utils/storage";
import { useState } from "react";

interface ChatRoomProps {
    room: ChatRoomType;
    userId: string;
    userName: string;
    onLogout: () => void;
}

export const ChatRoom = ({ room, userId, userName, onLogout }: ChatRoomProps) => {
    const [messages, setMessages] = useState<Message[]>(room.messages);
    const [newMessage, setNewMessage] = useState("");
    const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
            setMessages(updatedMessages);
            const rooms = loadChatRooms();
            const updatedRoom = { ...room, messages: updatedMessages };
            const updatedRooms = rooms.map((r) => (r.id === room.id ? updatedRoom : r));
            saveChatRooms(updatedRooms);
            setNewMessage("");
            setReplyToMessage(null);
            setSelectedFile(null);
        }
    };

    const handleReply = (message: Message) => {
        setReplyToMessage(message);
        setNewMessage(`@${message.userName}: `);
    };

    return (
        <div className="chat-room">
            <div className="chat-header">
                <h2>Комната: {room.name}</h2>
                <div>
                    <span>Пользователь: {userName}</span>
                    <button className="logout-button" onClick={onLogout}>
                        Выйти
                    </button>
                </div>
            </div>
            {replyToMessage && (
                <div className="replying-to">
                    Ответ пользователю {replyToMessage.userName}: {replyToMessage.text}
                    <button onClick={() => setReplyToMessage(null)}>Отмена</button>
                </div>
            )}
            <MessageList messages={messages} onReply={handleReply} />
            <div className="message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Введите сообщение"
                />
                <input type="file" accept="image/*" onChange={handleFileChange} /> {}
                <button onClick={handleSendMessage}>Отправить</button>
            </div>
        </div>
    );
};