import { ChatRoom } from "../types";

const CHAT_ROOMS_KEY = "chatRooms";

export const saveChatRooms = (rooms: ChatRoom[]) => {
    localStorage.setItem(CHAT_ROOMS_KEY, JSON.stringify(rooms));
};

export const loadChatRooms = (): ChatRoom[] => {
    const data = localStorage.getItem(CHAT_ROOMS_KEY);
    return data ? JSON.parse(data) : [];
};