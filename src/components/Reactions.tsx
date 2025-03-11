/** @jsxImportSource @emotion/react */
import { useState } from "react";
import styled from '@emotion/styled';

const REACTIONS = ['❤️', '😂', '😢', '🔥', '👍', '👎'];

interface ReactionsProps {
    messageId: string;
    userId: string;
    onReact: (messageId: string, reaction: string) => void;
}

const ReactionsContainer = styled.div`
    position: relative;
    display: inline-block;
`;

const ReactButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px 10px;
    font-size: 0.9rem;
    color: #666;
    transition: color 0.3s ease, transform 0.2s ease;

    &:hover {
        color: #1abc9c;
        transform: scale(1.1);
    }
`;

const ReactionsPopup = styled.div`
    position: absolute;
    bottom: 100%;
    left: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 20px;
    padding: 8px;
    display: flex;
    gap: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 100;
    animation: fadeIn 0.3s ease;

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const ReactionOption = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.4rem;
    padding: 5px;
    transition: transform 0.2s ease, filter 0.2s ease;

    &:hover {
        transform: scale(1.3);
        filter: brightness(1.2);
    }
`;

export const Reactions = ({ messageId, userId, onReact }: ReactionsProps) => {
    const [showReactions, setShowReactions] = useState(false);

    return (
        <ReactionsContainer>
            <ReactButton onClick={() => setShowReactions(!showReactions)}>
                +
            </ReactButton>

            {showReactions && (
                <ReactionsPopup>
                    {REACTIONS.map(reaction => (
                        <ReactionOption
                            key={reaction}
                            onClick={() => {
                                onReact(messageId, reaction);
                                setShowReactions(false);
                            }}
                        >
                            {reaction}
                        </ReactionOption>
                    ))}
                </ReactionsPopup>
            )}
        </ReactionsContainer>
    );
};