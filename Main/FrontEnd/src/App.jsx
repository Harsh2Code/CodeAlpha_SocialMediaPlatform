import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Navbar from './Components/Navbar'
import DashBoard from './Components/DashBoard'
import LoginPage from './Components/Login';
import {  BrowserRouter,Routes, Route, } from 'react-router-dom';
import Account from './Components/Account'
import CreatePost from './Components/CreatePost'
import Register from './Components/Register'

// Removed import of App.css to avoid Tailwind CSS processing error
// import './App.css'

import { AuthProvider } from './contexts/AuthContext'

function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
      <Navbar />
      <div style={{ paddingTop: '4rem' }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DashBoard />} />

            {/* Add other routes here */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/account" element={<Account />} />
            <Route path='/create' element={<CreatePost />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  )
}

export default App
