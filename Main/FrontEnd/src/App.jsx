import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Login from './Components/Login';
import Register from './Components/Register';
import Account from './Components/Account';
import Users from './Components/Users';
import UserProfile from './Components/UserProfile';
import { AuthProvider } from './contexts/AuthContext';
import Post from './Components/Post';
import CreatePost from './Components/CreatePost';

function UserProfileWrapper() {
  const { userId } = useParams();
  return <UserProfile userId={userId} />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div style={{ marginTop: '6em' }}>
          <Routes>
            <Route path="/" element={<Post />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<Account />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:userId" element={<UserProfileWrapper />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
