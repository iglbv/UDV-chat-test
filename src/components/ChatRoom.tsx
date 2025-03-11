/** @jsxImportSource @emotion/react */
import { MessageList } from "./MessageList";
import { ChatRoom as ChatRoomType, Message } from "../types";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useStorage } from "../providers/StorageProvider";
import styled from '@emotion/styled';

interface ChatRoomProps {
    userId: string;
    userName: string;
    onLogout: () => void;
}

const ChatRoomContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
`;

const ChatHeader = styled.div`
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: #2c3e50;
    color: white;
    padding: 1rem;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const RoomAvatar = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #1abc9c;
    color: white;
    font-size: 20px;
    font-weight: bold;
`;

const UserAvatar = styled.div`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #1abc9c;
    color: white;
    font-size: 16px;
    font-weight: bold;
`;

const LogoutButton = styled.button`
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-left: 1rem;

    &:hover {
        background-color: #c0392b;
    }
`;

const ReplyingToContainer = styled.div`
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    background-color: #f0f0f0;
    border-radius: 4px;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const CancelReplyButton = styled.button`
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: background-color 0.3s;

    &:hover {
        background-color: #c0392b;
    }
`;

const MessageInputContainer = styled.div`
    display: flex;
    padding: 1rem;
    background-color: #ecf0f1;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    gap: 0.5rem;
    align-items: center;
`;

const MessageInputField = styled.input`
    flex: 1;
    padding: 0.75rem;
    border: 1px solid #bdc3c7;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s;

    &:focus {
        border-color: #1abc9c;
        outline: none;
    }
`;

const FileInput = styled.input`
    display: none;
`;

const FileInputLabel = styled.label`
    padding: 0.75rem 1rem;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #2980b9;
    }
`;

const SelectedFileContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #34495e;
`;

const RemoveFileButton = styled.button`
    background: none;
    border: none;
    color: #e74c3c;
    cursor: pointer;
    font-size: 1rem;
    padding: 0;

    &:hover {
        color: #c0392b;
    }
`;

const SendButton = styled.button`
    padding: 0.75rem 1.5rem;
    background-color: #1abc9c;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #16a085;
    }
`;

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

    const handleRemoveFile = () => {
        setSelectedFile(null);
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
        <ChatRoomContainer>
            <ChatHeader>
                <RoomAvatar>
                    <div className="default-avatar">{room.name[0]}</div>
                </RoomAvatar>
                <h2>Комната: {room.name}</h2>
                <div>
                    <UserAvatar>
                        <div className="default-avatar">{userName[0]}</div>
                    </UserAvatar>
                    <span>Пользователь: {userName}</span>
                    <LogoutButton onClick={onLogout}>
                        Выйти из чата
                    </LogoutButton>
                </div>
            </ChatHeader>

            {replyToMessage && (
                <ReplyingToContainer>
                    Ответ пользователю {replyToMessage.userName}: {replyToMessage.text}
                    <CancelReplyButton onClick={() => setReplyToMessage(null)}>
                        Отмена
                    </CancelReplyButton>
                </ReplyingToContainer>
            )}

            <MessageList
                messages={messages}
                onReply={handleReply}
                onDeleteMessage={handleDeleteMessage}
                currentUserId={userId}
                onUpdateMessages={updateMessages}
            />

            <MessageInputContainer>
                <MessageInputField
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
                <FileInput
                    type="file"
                    id="file-input"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <FileInputLabel htmlFor="file-input">
                    Выбрать файл
                </FileInputLabel>
                {selectedFile && (
                    <SelectedFileContainer>
                        <span>{selectedFile.name}</span>
                        <RemoveFileButton onClick={handleRemoveFile}>
                            ×
                        </RemoveFileButton>
                    </SelectedFileContainer>
                )}
                <SendButton onClick={handleSendMessage}>Отправить</SendButton>
            </MessageInputContainer>
        </ChatRoomContainer>
    );
};