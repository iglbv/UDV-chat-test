import { useState } from "react";

const REACTIONS = ['❤️', '😂', '😢', '🔥', '👍', '👎'];

interface ReactionsProps {
    messageId: string;
    userId: string;
    onReact: (messageId: string, reaction: string) => void;
}

export const Reactions = ({ messageId, userId, onReact }: ReactionsProps) => {
    const [showReactions, setShowReactions] = useState(false);

    return (
        <div className="reactions-container">
            <button
                className="react-button"
                onClick={() => setShowReactions(!showReactions)}
            >
                +
            </button>

            {showReactions && (
                <div className="reactions-popup">
                    {REACTIONS.map(reaction => (
                        <button
                            key={reaction}
                            className="reaction-option"
                            onClick={() => {
                                onReact(messageId, reaction);
                                setShowReactions(false);
                            }}
                        >
                            {reaction}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};