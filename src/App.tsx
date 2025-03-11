import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { LoginForm } from "./components/LoginForm";
import { ChatRoom } from "./components/ChatRoom";
import { ChatList } from "./components/ChatList";
import { Toolbar } from "./components/Toolbar";
import { Footer } from "./components/Footer";
import { NotFoundPage } from "./components/NotFoundPage";
import { ProfilePage } from "./components/ProfilePage";
import { ChatRoom as ChatRoomType, User } from "./types";
import { useStorage } from "./providers/StorageProvider";
import { GlobalStyles } from './styles/GlobalStyles';
import styled from '@emotion/styled';

const ContentContainer = styled.div`
  margin-top: 70px;
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 40px;
`;

const AppContent = () => {
  const [user, setUser] = useState<User | null>(null);
  const [newRoomName, setNewRoomName] = useState("");
  const { rooms, saveRooms } = useStorage();
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userName: string) => {
    const user: User = {
      id: userName,
      name: userName,
    };
    setUser(user);
    sessionStorage.setItem("user", JSON.stringify(user));
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    sessionStorage.setItem("user", JSON.stringify(updatedUser));

    const updatedRooms = rooms.map(room => ({
      ...room,
      messages: room.messages.map(message =>
        message.userId === updatedUser.id ? { ...message, userName: updatedUser.name } : message
      ),
      creatorId: room.creatorId === updatedUser.id ? updatedUser.id : room.creatorId,
    }));
    saveRooms(updatedRooms);
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
      saveRooms(updatedRooms);
    }
  };

  const handleDeleteRoom = (roomId: string) => {
    const roomToDelete = rooms.find((room) => room.id === roomId);
    if (roomToDelete && user && roomToDelete.creatorId === user.id) {
      const confirmDelete = window.confirm("Вы точно хотите удалить этот чат? Все данные будут утеряны.");
      if (confirmDelete) {
        const updatedRooms = rooms.filter((room) => room.id !== roomId);
        saveRooms(updatedRooms);
      }
    } else {
      alert("Вы не можете удалить этот чат, так как вы не являетесь его создателем.");
    }
  };

  const handleToolbarLogout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    navigate("/chatrooms");
  };

  return (
    <>
      <Toolbar
        user={user}
        onLogoutClick={handleToolbarLogout}
        onTitleClick={() => navigate("/chatrooms")}
      />
      <ContentContainer>
        <Routes>
          <Route path="/login" element={!user ? <LoginForm onLogin={handleLogin} /> : <Navigate to="/chatrooms" />} />
          <Route path="/" element={<Navigate to="/chatrooms" />} />
          <Route path="/chatrooms" element={user ? (
            <ChatList
              rooms={rooms}
              onCreateRoom={handleCreateRoom}
              onDeleteRoom={handleDeleteRoom}
              newRoomName={newRoomName}
              setNewRoomName={setNewRoomName}
              user={user}
            />
          ) : <Navigate to="/login" />} />
          <Route path="/room/:roomId" element={user ? (
            <ChatRoom
              userId={user.id}
              userName={user.name}
              onLogout={() => navigate("/chatrooms")}
            />
          ) : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? (
            <ProfilePage
              user={user}
              onUpdateUser={handleUpdateUser}
            />
          ) : <Navigate to="/login" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ContentContainer>
      <Footer />
    </>
  );
};

export const App = () => {
  return (
    <Router>
      <GlobalStyles />
      <AppContent />
    </Router>
  );
};