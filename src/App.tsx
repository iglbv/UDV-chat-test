import './App.css';
import { useState, useEffect } from "react";
import { LoginForm } from "./components/LoginForm";
import { ChatRoom } from "./components/ChatRoom";
import { ChatList } from "./components/ChatList";
import { Toolbar } from "./components/Toolbar";
import { ChatRoom as ChatRoomType, User } from "./types";
import { loadChatRooms, saveChatRooms } from "./utils/storage";

export const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [room, setRoom] = useState<ChatRoomType | null>(null);
  const [rooms, setRooms] = useState<ChatRoomType[]>(loadChatRooms());
  const [newRoomName, setNewRoomName] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false);

  useEffect(() => {
    setRooms(loadChatRooms());
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userName: string) => {
    const userId = Date.now().toString();
    const user = { id: userId, name: userName };
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    setShowLoginForm(false);
  };

  const handleSelectRoom = (selectedRoom: ChatRoomType) => {
    if (user) {
      setRoom(selectedRoom);
    } else {
      setShowLoginForm(true);
    }
  };

  const handleCreateRoom = (roomName: string) => {
    if (roomName.trim()) {
      const newRoom = { id: Date.now().toString(), name: roomName.trim(), messages: [] };
      const updatedRooms = [...rooms, newRoom];
      saveChatRooms(updatedRooms);
      setRooms(updatedRooms);
      setRoom(newRoom);
    }
  };

  const handleDeleteRoom = (roomId: string) => {
    const confirmDelete = window.confirm("Вы точно хотите удалить этот чат? Все данные будут утеряны.");
    if (confirmDelete) {
      const updatedRooms = rooms.filter((room) => room.id !== roomId);
      saveChatRooms(updatedRooms);
      setRooms(updatedRooms);

      if (room?.id === roomId) {
        setRoom(null);
      }
    }
  };

  const handleChatLogout = () => {
    setRoom(null);
  };

  const handleToolbarLogout = () => {
    setUser(null);
    setRoom(null);
    localStorage.removeItem("user");
  };

  const handleLoginClick = () => {
    setShowLoginForm(true);
  };

  return (
    <div>
      <Toolbar user={user} onLoginClick={handleLoginClick} onLogoutClick={handleToolbarLogout} />
      <div className="content">
        {!user || showLoginForm ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <>
            {!room ? (
              <ChatList
                rooms={rooms}
                onSelectRoom={handleSelectRoom}
                onCreateRoom={handleCreateRoom}
                onDeleteRoom={handleDeleteRoom}
                newRoomName={newRoomName}
                setNewRoomName={setNewRoomName}
              />
            ) : (
              <ChatRoom
                room={room}
                userId={user.id}
                userName={user.name}
                onLogout={handleChatLogout}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};