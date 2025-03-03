import { useState } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface EmojiPickerProps {
    onEmojiClick: (emoji: string) => void;
}

export const CustomEmojiPicker = ({ onEmojiClick }: EmojiPickerProps) => {
    const [isPickerVisible, setPickerVisible] = useState(false);

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        onEmojiClick(emojiData.emoji);
        setPickerVisible(false);
    };

    return (
        <div className="emoji-picker-container">
            <button
                className="emoji-button"
                onClick={() => setPickerVisible(!isPickerVisible)}
            >
                😀
            </button>
            {isPickerVisible && (
                <div className="emoji-picker">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
            )}
        </div>
    );
};