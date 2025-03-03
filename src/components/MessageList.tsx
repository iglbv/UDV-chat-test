import { Message } from "../types";
import { useRef, useEffect } from "react";

interface MessageListProps {
    messages: Message[];
    onReply: (message: Message) => void;
}

export const MessageList = ({ messages, onReply }: MessageListProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="message-list-container">
            <div className="message-list">
                {messages.map((message) => (
                    <div key={message.id} className="message">
                        <strong>{message.userName}:</strong>
                        <div className="message-content">
                            {message.replyTo && (
                                <div className="quoted-message">
                                    Ответ пользователю: {messages.find((m) => m.id === message.replyTo)?.text}
                                </div>
                            )}
                            {message.text}
                            {message.mediaUrl && (
                                <img src={message.mediaUrl} alt="Media" className="message-media" />
                            )}
                        </div>
                        <button className="reply-button" onClick={() => onReply(message)}>Ответить</button>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};