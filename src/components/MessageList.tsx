import { Message } from "../types";
import { useRef, useEffect, useState } from "react";

const REACTIONS = ['❤️', '😂', '😢', '🔥', '👍', '👎'];

interface MessageListProps {
    messages: Message[];
    onReply: (message: Message) => void;
    onDeleteMessage: (messageId: string) => void;
    currentUserId: string;
    onUpdateMessages: (messages: Message[]) => void;
}

export const MessageList = ({
    messages,
    onReply,
    onDeleteMessage,
    currentUserId,
    onUpdateMessages
}: MessageListProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editedMessageText, setEditedMessageText] = useState("");

    useEffect(() => {
        if (editingMessageId && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingMessageId]);

    const handleReact = (messageId: string, reaction: string) => {
        const updatedMessages = messages.map(msg => {
            if (msg.id === messageId) {
                const reactions = msg.reactions || [];
                const userReactionIndex = reactions.findIndex(r => r.userId === currentUserId);

                if (userReactionIndex >= 0) {
                    if (reactions[userReactionIndex].type === reaction) {
                        return {
                            ...msg,
                            reactions: reactions.filter(r => r.userId !== currentUserId)
                        };
                    }
                    reactions[userReactionIndex].type = reaction;
                } else {
                    reactions.push({ type: reaction, userId: currentUserId });
                }

                return { ...msg, reactions };
            }
            return msg;
        });

        onUpdateMessages(updatedMessages);
    };

    const handleEditMessage = (messageId: string, currentText: string) => {
        setEditingMessageId(messageId);
        setEditedMessageText(currentText);
    };

    const handleSaveEditedMessage = (messageId: string) => {
        const updatedMessages = messages.map(msg => {
            if (msg.id === messageId) {
                return {
                    ...msg,
                    text: editedMessageText,
                    isEdited: true
                };
            }
            return msg;
        });

        onUpdateMessages(updatedMessages);
        setEditingMessageId(null);
        setEditedMessageText("");
    };

    const handleCancelEdit = () => {
        setEditingMessageId(null);
        setEditedMessageText("");
    };

    return (
        <div className="message-list-container">
            <div className="message-list">
                {messages.map((message) => (
                    <div key={message.id} className={`message ${editingMessageId === message.id ? 'editing' : ''}`}>
                        <strong>{message.userName}:</strong>
                        <div className="message-content-wrapper">
                            <div className="message-content">
                                {message.replyTo && (
                                    <div className="quoted-message">
                                        {(() => {
                                            const quotedMessage = messages.find(m => m.id === message.replyTo);
                                            return quotedMessage ? (
                                                <>
                                                    Ответ пользователю {quotedMessage.userName}:
                                                    {quotedMessage.text}
                                                </>
                                            ) : (
                                                <span className="deleted-message-text">
                                                    Сообщение удалено
                                                </span>
                                            );
                                        })()}
                                    </div>
                                )}
                                {editingMessageId === message.id ? (
                                    <>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={editedMessageText}
                                            onChange={(e) => setEditedMessageText(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleSaveEditedMessage(message.id);
                                                }
                                            }}
                                        />
                                        <div className="edit-buttons">
                                            <button className="save-button" onClick={() => handleSaveEditedMessage(message.id)}>
                                                Сохранить
                                            </button>
                                            <button className="cancel-button" onClick={handleCancelEdit}>
                                                Отмена
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {message.text}
                                        {message.isEdited && <span className="edited-label"> (изменено)</span>}
                                    </>
                                )}
                                {message.mediaUrl && (
                                    <div className="media-container">
                                        <img
                                            src={message.mediaUrl}
                                            alt="Media"
                                            className="message-media"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="hover-reactions">
                                {REACTIONS.map(reaction => (
                                    <button
                                        key={reaction}
                                        className="reaction-option"
                                        onClick={() => handleReact(message.id, reaction)}
                                    >
                                        {reaction}
                                    </button>
                                ))}
                                <div className="reaction-divider"></div>
                                {message.userId === currentUserId && (
                                    <div className="edit-icon-wrapper">
                                        <button
                                            className="edit-icon-button"
                                            onClick={() => handleEditMessage(message.id, message.text)}
                                            title="Изменить"
                                        >
                                            ✏️
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="message-actions">
                            <button
                                className="reply-button"
                                onClick={() => onReply(message)}
                            >
                                Ответить
                            </button>
                            {message.userId === currentUserId && (
                                <button
                                    className="delete-message-button"
                                    onClick={() => onDeleteMessage(message.id)}
                                >
                                    Удалить
                                </button>
                            )}
                        </div>
                        {message.reactions && message.reactions.length > 0 && (
                            <div className="message-reactions">
                                {message.reactions.reduce((acc, reaction) => {
                                    const existing = acc.find(r => r.type === reaction.type);
                                    if (existing) {
                                        existing.count++;
                                    } else {
                                        acc.push({ type: reaction.type, count: 1 });
                                    }
                                    return acc;
                                }, [] as { type: string; count: number }[]).map(reaction => (
                                    <button
                                        className={`reaction ${message.reactions?.some(r =>
                                            r.type === reaction.type &&
                                            r.userId === currentUserId
                                        ) ? 'active' : ''
                                            }`}
                                        onClick={() => handleReact(message.id, reaction.type)}
                                        key={reaction.type}
                                    >
                                        {reaction.type} {reaction.count > 1 ? reaction.count : ''}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};