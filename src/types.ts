export interface User {
    id: string;
    name: string;
}

export interface Reaction {
    type: string;
    userId: string;
}

export interface Message {
    id: string;
    text: string;
    userId: string;
    userName: string;
    timestamp: number;
    replyTo?: string;
    mediaUrl?: string;
    reactions?: Reaction[]; // Добавляем реакции
}

export interface ChatRoom {
    id: string;
    name: string;
    messages: Message[];
    creatorId: string;
}