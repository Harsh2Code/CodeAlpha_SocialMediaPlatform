import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Navbar from './Components/Navbar'
import DashBoard from './Components/DashBoard'
import LoginPage from './Components/Login';
import {  BrowserRouter,Routes, Route, } from 'react-router-dom';
import Account from './Components/Account'

// Removed import of App.css to avoid Tailwind CSS processing error
// import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '4rem' }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DashBoard />} />

            {/* Add other routes here */}
            <Route path="/login" element={<LoginPage />} />
            {/* <Route path="/Register" element={<RegisterPage />} /> */}
            <Route path="/account" element={<Account />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
