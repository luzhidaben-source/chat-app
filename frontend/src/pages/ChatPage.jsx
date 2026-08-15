import { useState, useEffect, useRef } from 'react'
import '../styles/ChatPage.css'

const AVATAR_EMOJIS = {
  avatar1: '😊',
  avatar2: '😎',
  avatar3: '🤓',
  avatar4: '😍',
  avatar5: '🚀',
  avatar6: '🎨',
}

const ROOM_NAMES = {
  'room1': 'ゼネラル',
  'room2': 'ゲーム',
  'room3': 'アニメ',
  'room4': '雑談',
}

export default function ChatPage({ username, avatar, roomId, socket, onBack }) {
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!socket) return

    socket.on('user_joined', (data) => {
      setMessages(prev => [...prev, {
        type: 'system',
        message: data.message,
        timestamp: new Date().toLocaleTimeString('ja-JP')
      }])
      setUsers(data.users)
    })

    socket.on('receive_message', (data) => {
      setMessages(prev => [...prev, {
        type: 'message',
        username: data.username,
        avatar: data.avatar,
        message: data.message,
        timestamp: data.timestamp
      }])
    })

    socket.on('user_left', (data) => {
      setUsers(data.users)
    })

    return () => {
      socket.off('user_joined')
      socket.off('receive_message')
      socket.off('user_left')
    }
  }, [socket])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (inputValue.trim() === '' || !socket) return

    socket.emit('send_message', {
      roomId,
      username,
      avatar,
      message: inputValue.trim()
    })

    setInputValue('')
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-header">
          <button className="back-button" onClick={onBack}>
            ← 戻る
          </button>
          <div className="header-info">
            <h2>{ROOM_NAMES[roomId] || roomId}</h2>
            <span className="user-count">👥 {users.length}人</span>
          </div>
        </div>

        <div className="chat-content">
          <aside className="users-sidebar">
            <h3>ユーザー一覧</h3>
            <ul className="users-list">
              {users.map((user) => (
                <li key={user.id} className="user-item">
                  <span className="user-avatar">{AVATAR_EMOJIS[user.avatar]}</span>
                  <span className="user-name">{user.username}</span>
                </li>
              ))}
            </ul>
          </aside>

          <div className="chat-main">
            <div className="messages-container">
              {messages.length === 0 ? (
                <div className="empty-message">
                  <p>まだメッセージがありません</p>
                  <p>最初のメッセージを送信してください 💬</p>
                </div>
              ) : (
                messages.map((msg, idx) =>
                  msg.type === 'system' ? (
                    <div key={idx} className="system-message">
                      <span>{msg.message}</span>
                      <small>{msg.timestamp}</small>
                    </div>
                  ) : (
                    <div key={idx} className="message-item">
                      <div className="message-avatar">{AVATAR_EMOJIS[msg.avatar]}</div>
                      <div className="message-content">
                        <div className="message-header">
                          <strong>{msg.username}</strong>
                          <small>{msg.timestamp}</small>
                        </div>
                        <p className="message-text">{msg.message}</p>
                      </div>
                    </div>
                  )
                )
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="message-form">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="メッセージを入力..."
                className="message-input"
              />
              <button type="submit" className="send-button">
                送信
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
