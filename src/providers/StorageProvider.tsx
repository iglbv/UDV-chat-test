import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    ReactNode,
} from 'react';
import { ChatRoom } from '../types';

interface StorageContextProps {
    rooms: ChatRoom[];
    saveRooms: (rooms: ChatRoom[]) => void;
}

const StorageContext = createContext<StorageContextProps | undefined>(undefined);

interface StorageProviderProps {
    children: ReactNode;
}

const CHAT_ROOMS_KEY = "chatRooms";

export const StorageProvider = ({ children }: StorageProviderProps) => {
    const [rooms, setRooms] = useState<ChatRoom[]>(() => {
        const data = localStorage.getItem(CHAT_ROOMS_KEY);
        return data ? JSON.parse(data) : [];
    });

    useEffect(() => {
        localStorage.setItem(CHAT_ROOMS_KEY, JSON.stringify(rooms));
    }, [rooms]);

    useEffect(() => {
        const handleStorage = (event: StorageEvent) => {
            if (event.key === CHAT_ROOMS_KEY) {
                try {
                    const newRooms = JSON.parse(event.newValue || '[]');
                    setRooms(newRooms);
                } catch (error) {
                    console.error("Error parsing chat rooms from localStorage:", error);
                }
            }
        };

        window.addEventListener('storage', handleStorage);

        return () => {
            window.removeEventListener('storage', handleStorage);
        };
    }, []);

    const saveRooms = (newRooms: ChatRoom[]) => {
        setRooms(newRooms);
    };

    const value: StorageContextProps = {
        rooms,
        saveRooms,
    };

    return (
        <StorageContext.Provider value={value}>
            {children}
        </StorageContext.Provider>
    );
};

export const useStorage = (): StorageContextProps => {
    const context = useContext(StorageContext);
    if (!context) {
        throw new Error("useStorage must be used within a StorageProvider");
    }
    return context;
};