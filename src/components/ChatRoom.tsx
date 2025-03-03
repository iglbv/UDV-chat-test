import { MessageList } from "./MessageList";
import { ChatRoom as ChatRoomType, Message } from "../types";
import { CustomEmojiPicker } from "./EmojiPicker";
import { useState } from "react";
import { loadChatRooms } from "../utils/storage";

interface ChatRoomProps {
    room: ChatRoomType;
    userId: string;
    userName: string;
    onLogout: () => void;
    updateRooms: (rooms: ChatRoomType[]) => void;
}

export const ChatRoom = ({ room, userId, userName, onLogout, updateRooms }: ChatRoomProps) => {
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

            const updatedRoom = { ...room, messages: updatedMessages };
            const rooms = loadChatRooms();
            const updatedRooms = rooms.map((r) => (r.id === room.id ? updatedRoom : r));
            updateRooms(updatedRooms);

            setNewMessage("");
            setReplyToMessage(null);
            setSelectedFile(null);
        }
    };

    const handleDeleteMessage = (messageId: string) => {
        const updatedMessages = messages.filter((message) => message.id !== messageId);
        setMessages(updatedMessages);

        const updatedRoom = { ...room, messages: updatedMessages };
        const rooms = loadChatRooms();
        const updatedRooms = rooms.map((r) => (r.id === room.id ? updatedRoom : r));
        updateRooms(updatedRooms);
    };

    const handleReply = (message: Message) => {
        setReplyToMessage(message);
        setNewMessage(`@${message.userName}: `);
    };

    const handleEmojiClick = (emoji: string) => {
        setNewMessage((prevMessage) => prevMessage + emoji);
    };

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
            />
            <div className="message-input">
                <CustomEmojiPicker onEmojiClick={handleEmojiClick} />
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
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <button onClick={handleSendMessage}>Отправить</button>
            </div>
        </div>
    );
};