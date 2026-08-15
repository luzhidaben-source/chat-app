import { useState } from 'react'
import io from 'socket.io-client'
import HomePage from './pages/HomePage'
import RoomListPage from './pages/RoomListPage'
import ChatPage from './pages/ChatPage'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [username, setUsername] = useState('')
  const [avatar, setAvatar] = useState('avatar1')
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [socket, setSocket] = useState(null)

  const handleNameSet = (name, selectedAvatar) => {
    setUsername(name)
    setAvatar(selectedAvatar)
    setCurrentPage('roomList')
  }

  const handleRoomSelect = (roomId) => {
    setSelectedRoom(roomId)
    
    const newSocket = io(API_URL)
    setSocket(newSocket)
    
    newSocket.emit('join_room', {
      username,
      avatar,
      roomId
    })
    
    setCurrentPage('chat')
  }

  const handleBackToRooms = () => {
    socket?.disconnect()
    setSocket(null)
    setCurrentPage('roomList')
  }

  const handleBackToHome = () => {
    socket?.disconnect()
    setSocket(null)
    setCurrentPage('home')
  }

  return (
    <div className="App">
      {currentPage === 'home' && (
        <HomePage onNameSet={handleNameSet} />
      )}
      {currentPage === 'roomList' && (
        <RoomListPage 
          username={username}
          onRoomSelect={handleRoomSelect}
          onBack={handleBackToHome}
          apiUrl={API_URL}
        />
      )}
      {currentPage === 'chat' && (
        <ChatPage 
          username={username}
          avatar={avatar}
          roomId={selectedRoom}
          socket={socket}
          onBack={handleBackToRooms}
        />
      )}
    </div>
  )
}

export default App
