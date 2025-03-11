/** @jsxImportSource @emotion/react */
import { Message } from "../types";
import { useRef, useEffect, useState } from "react";
import styled from '@emotion/styled';

const REACTIONS = ['❤️', '😂', '😢', '🔥', '👍', '👎'];

interface MessageListProps {
    messages: Message[];
    onReply: (message: Message) => void;
    onDeleteMessage: (messageId: string) => void;
    currentUserId: string;
    onUpdateMessages: (messages: Message[]) => void;
}

const MessageListContainer = styled.div`
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 400px);
    max-height: calc(100vh - 400px);
    padding: 2rem;
`;

const MessageItem = styled.div`
    margin-bottom: 1rem;
    padding: 1rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    word-break: break-word;
    position: relative;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }
`;

const MessageActions = styled.div`
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    gap: 0.5rem;
`;

const ReplyButton = styled.button`
    background-color: transparent;
    border: none;
    color: #34495e;
    padding: 0.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s ease, color 0.3s ease;

    &:hover {
        background-color: #1abc9c;
        color: white;
    }
`;

const DeleteMessageButton = styled.button`
    background-color: #ff4d4d;
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #ff1a1a;
    }
`;

const MessageContentWrapper = styled.div`
    position: relative;
    margin-bottom: 0.5rem;

    &:hover .hover-reactions {
        display: flex;
    }
`;

const HoverReactions = styled.div`
    position: absolute;
    bottom: 100%;
    left: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 20px;
    padding: 0.5rem;
    display: none;
    gap: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 100;
`;

const ReactionOption = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0.25rem;
    transition: transform 0.2s ease;

    &:hover {
        transform: scale(1.2);
    }
`;

const MessageReactionsContainer = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
    flex-wrap: wrap;
`;

const ReactionButton = styled.button`
    background: #f0f0f0;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.9rem;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    transition: background-color 0.2s ease, transform 0.2s ease;

    &:hover {
        background-color: #e0e0e0;
    }

    &:active {
        transform: scale(0.95);
    }

    &.active {
        background-color: #d1e8ff;
        border: 1px solid #90caf9;
    }
`;

const QuotedMessage = styled.div`
    background: #f9f9f9;
    border-left: 3px solid #1abc9c;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    border-radius: 4px;
    font-size: 0.9rem;
    color: #7f8c8d;
`;

const DeletedMessageText = styled.span`
    color: #ff4d4d;
    font-style: italic;
`;

const EditInput = styled.input`
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    margin-bottom: 0.5rem;
    transition: border-color 0.3s ease;

    &:focus {
        border-color: #1abc9c;
        outline: none;
    }
`;

const EditButtons = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
`;

const SaveButton = styled.button`
    background-color: #1abc9c;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #16a085;
    }
`;

const CancelButton = styled.button`
    background-color: #ff4d4d;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #ff1a1a;
    }
`;

const EditedLabel = styled.span`
    font-size: 0.8rem;
    color: #7f8c8d;
    margin-left: 0.5rem;
`;

const MediaContainer = styled.div`
    margin-top: 0.5rem;

    img {
        max-width: 100%;
        border-radius: 8px;
    }
`;

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
    const prevMessagesLength = useRef(messages.length);

    useEffect(() => {
        if (messages.length > prevMessagesLength.current) {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }
        prevMessagesLength.current = messages.length;
    }, [messages]);

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
        <MessageListContainer>
            <div className="message-list">
                {messages.map((message) => (
                    <MessageItem key={message.id} className={`message ${editingMessageId === message.id ? 'editing' : ''}`}>
                        <strong>{message.userName}:</strong>
                        <MessageContentWrapper>
                            <div className="message-content">
                                {message.replyTo && (
                                    <QuotedMessage>
                                        {(() => {
                                            const quotedMessage = messages.find(m => m.id === message.replyTo);
                                            return quotedMessage ? (
                                                <>
                                                    Ответ пользователю {quotedMessage.userName}: {quotedMessage.text}
                                                </>
                                            ) : (
                                                <DeletedMessageText>
                                                    Сообщение удалено
                                                </DeletedMessageText>
                                            );
                                        })()}
                                    </QuotedMessage>
                                )}
                                {editingMessageId === message.id ? (
                                    <>
                                        <EditInput
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
                                        <EditButtons>
                                            <SaveButton onClick={() => handleSaveEditedMessage(message.id)}>
                                                Сохранить
                                            </SaveButton>
                                            <CancelButton onClick={handleCancelEdit}>
                                                Отмена
                                            </CancelButton>
                                        </EditButtons>
                                    </>
                                ) : (
                                    <>
                                        {message.text}
                                        {message.isEdited && <EditedLabel>(изменено)</EditedLabel>}
                                    </>
                                )}
                                {message.mediaUrl && (
                                    <MediaContainer>
                                        <img
                                            src={message.mediaUrl}
                                            alt="Media"
                                            className="message-media"
                                        />
                                    </MediaContainer>
                                )}
                            </div>

                            <HoverReactions className="hover-reactions">
                                {REACTIONS.map(reaction => (
                                    <ReactionOption
                                        key={reaction}
                                        onClick={() => handleReact(message.id, reaction)}
                                    >
                                        {reaction}
                                    </ReactionOption>
                                ))}
                                <div style={{ margin: "0 0.5rem", color: "#000", padding: "3px" }}>|</div>
                                {message.userId === currentUserId && (
                                    <ReactionOption
                                        onClick={() => handleEditMessage(message.id, message.text)}
                                        title="Изменить"
                                    >
                                        ✏️
                                    </ReactionOption>
                                )}
                            </HoverReactions>
                        </MessageContentWrapper>

                        <MessageActions>
                            <ReplyButton onClick={() => onReply(message)}>
                                Ответить
                            </ReplyButton>
                            {message.userId === currentUserId && (
                                <DeleteMessageButton onClick={() => onDeleteMessage(message.id)}>
                                    Удалить
                                </DeleteMessageButton>
                            )}
                        </MessageActions>
                        {message.reactions && message.reactions.length > 0 && (
                            <MessageReactionsContainer>
                                {message.reactions.reduce((acc, reaction) => {
                                    const existing = acc.find(r => r.type === reaction.type);
                                    if (existing) {
                                        existing.count++;
                                    } else {
                                        acc.push({ type: reaction.type, count: 1 });
                                    }
                                    return acc;
                                }, [] as { type: string; count: number }[]).map(reaction => (
                                    <ReactionButton
                                        className={`reaction ${message.reactions?.some(r =>
                                            r.type === reaction.type &&
                                            r.userId === currentUserId
                                        ) ? 'active' : ''
                                            }`}
                                        onClick={() => handleReact(message.id, reaction.type)}
                                        key={reaction.type}
                                    >
                                        {reaction.type} {reaction.count > 1 ? reaction.count : ''}
                                    </ReactionButton>
                                ))}
                            </MessageReactionsContainer>
                        )}
                    </MessageItem>
                ))}
                <div ref={messagesEndRef} />
            </div>
        </MessageListContainer>
    );
};