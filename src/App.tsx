import './App.css';
import { useState, useEffect } from "react";
import { LoginForm } from "./components/LoginForm";
import { ChatRoom } from "./components/ChatRoom";
import { ChatList } from "./components/ChatList";
import { Toolbar } from "./components/Toolbar";
import { Footer } from "./components/Footer";
import { ChatRoom as ChatRoomType, User } from "./types";
import { loadChatRooms, saveChatRooms } from "./utils/storage";

export const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [room, setRoom] = useState<ChatRoomType | null>(null);
  const [rooms, setRooms] = useState<ChatRoomType[]>(loadChatRooms());
  const [newRoomName, setNewRoomName] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedRoomId = localStorage.getItem("selectedRoomId");
    if (savedRoomId) {
      const rooms = loadChatRooms();
      const selectedRoom = rooms.find((room) => room.id === savedRoomId);
      if (selectedRoom) {
        setRoom(selectedRoom);
      }
    }
  }, []);

  const updateRooms = (updatedRooms: ChatRoomType[]) => {
    setRooms(updatedRooms);
    saveChatRooms(updatedRooms);
  };

  const handleLogin = (userName: string) => {
    const user: User = {
      id: userName,
      name: userName,
    };
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    setShowLoginForm(false);
  };

  const handleSelectRoom = (selectedRoom: ChatRoomType) => {
    if (user) {
      setRoom(selectedRoom);
      localStorage.setItem("selectedRoomId", selectedRoom.id);
    } else {
      setShowLoginForm(true);
    }
  };

  const handleCreateRoom = (roomName: string) => {
    if (roomName.trim() && user) {
      const newRoom = {
        id: Date.now().toString(),
        name: roomName.trim(),
        messages: [],
        creatorId: user.id,
        avatarUrl: "",
      };
      const updatedRooms = [...rooms, newRoom];
      updateRooms(updatedRooms);
      setRoom(newRoom); 
      localStorage.setItem("selectedRoomId", newRoom.id);
    }
  };

  // Обработчик удаления комнаты
  const handleDeleteRoom = (roomId: string) => {
    const roomToDelete = rooms.find((room) => room.id === roomId);
    if (roomToDelete && user && roomToDelete.creatorId === user.id) {
      const confirmDelete = window.confirm("Вы точно хотите удалить этот чат? Все данные будут утеряны.");
      if (confirmDelete) {
        const updatedRooms = rooms.filter((room) => room.id !== roomId);
        updateRooms(updatedRooms);

        if (room?.id === roomId) {
          setRoom(null);
          localStorage.removeItem("selectedRoomId");
        }
      }
    } else {
      alert("Вы не можете удалить этот чат, так как вы не являетесь его создателем.");
    }
  };

  const handleChatLogout = () => {
    setRoom(null);
    localStorage.removeItem("selectedRoomId");
  };

  const handleToolbarLogout = () => {
    setUser(null);
    setRoom(null);
    localStorage.removeItem("user");
    localStorage.removeItem("selectedRoomId");
  };

  const handleTitleClick = () => {
    setRoom(null);
    localStorage.removeItem("selectedRoomId");
  };

  return (
    <div>
      <Toolbar
        user={user}
        onLoginClick={() => setShowLoginForm(true)}
        onLogoutClick={handleToolbarLogout}
        onTitleClick={handleTitleClick}
      />
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
                user={user}
                setRooms={setRooms}
              />
            ) : (
              <ChatRoom
                room={room}
                userId={user.id}
                userName={user.name}
                onLogout={handleChatLogout}
                updateRooms={updateRooms} 
              />
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};