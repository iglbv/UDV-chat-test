import './App.css';
import { useState, useEffect } from "react";
import { LoginForm } from "./components/LoginForm";
import { ChatRoom } from "./components/ChatRoom";
import { ChatList } from "./components/ChatList";
import { Toolbar } from "./components/Toolbar";
import { Footer } from "./components/Footer";
import { ChatRoom as ChatRoomType, User } from "./types";
import { loadChatRooms, saveChatRooms, CHAT_ROOMS_KEY } from "./utils/storage";

export const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [room, setRoom] = useState<ChatRoomType | null>(null);
  const [rooms, setRooms] = useState<ChatRoomType[]>(loadChatRooms());
  const [newRoomName, setNewRoomName] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false);

  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedRoomId = sessionStorage.getItem("selectedRoomId");
    if (savedRoomId) {
      const rooms = loadChatRooms();
      const selectedRoom = rooms.find((room) => room.id === savedRoomId);
      if (selectedRoom) {
        setRoom(selectedRoom);
      }
    }
  }, []);

  useEffect(() => {
    const handleStorageUpdate = (e: StorageEvent) => {
      if (e.key === CHAT_ROOMS_KEY) {
        const updatedRooms = loadChatRooms();
        setRooms(updatedRooms);

        if (room) {
          const currentRoom = updatedRooms.find(r => r.id === room.id);
          if (currentRoom) {
            setRoom(currentRoom);
          } else {
            setRoom(null);
            sessionStorage.removeItem("selectedRoomId");
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageUpdate);
    return () => window.removeEventListener('storage', handleStorageUpdate);
  }, [room]);

  const updateRooms = (updatedRooms: ChatRoomType[]) => {
    setRooms(updatedRooms);
    saveChatRooms(updatedRooms);
    localStorage.setItem(CHAT_ROOMS_KEY, JSON.stringify(updatedRooms));
  };

  const handleLogin = (userName: string) => {
    const user: User = {
      id: userName,
      name: userName,
    };
    setUser(user);
    sessionStorage.setItem("user", JSON.stringify(user));
    setShowLoginForm(false);
  };

  const handleSelectRoom = (selectedRoom: ChatRoomType) => {
    if (user) {
      setRoom(selectedRoom);
      sessionStorage.setItem("selectedRoomId", selectedRoom.id);
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
      sessionStorage.setItem("selectedRoomId", newRoom.id);
    }
  };

  const handleDeleteRoom = (roomId: string) => {
    const roomToDelete = rooms.find((room) => room.id === roomId);
    if (roomToDelete && user && roomToDelete.creatorId === user.id) {
      const confirmDelete = window.confirm("Вы точно хотите удалить этот чат? Все данные будут утеряны.");
      if (confirmDelete) {
        const updatedRooms = rooms.filter((room) => room.id !== roomId);
        updateRooms(updatedRooms);

        if (room?.id === roomId) {
          setRoom(null);
          sessionStorage.removeItem("selectedRoomId");
        }
      }
    } else {
      alert("Вы не можете удалить этот чат, так как вы не являетесь его создателем.");
    }
  };

  const handleChatLogout = () => {
    setRoom(null);
    sessionStorage.removeItem("selectedRoomId");
  };

  const handleToolbarLogout = () => {
    setUser(null);
    setRoom(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("selectedRoomId");
  };

  const handleTitleClick = () => {
    setRoom(null);
    sessionStorage.removeItem("selectedRoomId");
  };

  return (
    <div>
      <Toolbar
        user={user}
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