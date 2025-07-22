import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// Removed import of App.css to avoid Tailwind CSS processing error
// import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-purple-500 text-white p-4 rounded-lg shadow-lg">
          Tailwind CSS is working!
        </div>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Test Button
        </button>
      </div>
    </>
  )
}

export default App
