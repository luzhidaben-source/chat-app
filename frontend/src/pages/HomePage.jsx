import { useState } from 'react'
import '../styles/HomePage.css'

const AVATARS = [
  { id: 'avatar1', emoji: '😊', label: 'スマイル' },
  { id: 'avatar2', emoji: '😎', label: 'クール' },
  { id: 'avatar3', emoji: '🤓', label: 'スマート' },
  { id: 'avatar4', emoji: '😍', label: 'ハート' },
  { id: 'avatar5', emoji: '🚀', label: 'ロケット' },
  { id: 'avatar6', emoji: '🎨', label: 'アート' },
]

export default function HomePage({ onNameSet }) {
  const [name, setName] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState('avatar1')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim().length === 0) {
      setError('名前を入力してください')
      return
    }
    if (name.trim().length > 20) {
      setError('名前は20文字以内で入力してください')
      return
    }
    onNameSet(name.trim(), selectedAvatar)
  }

  return (
    <div className="home-page">
      <div className="home-card">
        <div className="home-header">
          <h1>💬 Chat App へようこそ</h1>
          <p>名前とアイコンを設定して始めましょう</p>
        </div>

        <form onSubmit={handleSubmit} className="home-form">
          <div className="form-group">
            <label htmlFor="username">ユーザー名</label>
            <input
              id="username"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
              placeholder="例: Taro"
              maxLength="20"
              className="name-input"
            />
            {error && <p className="error-message">{error}</p>}
          </div>

          <div className="form-group">
            <label>アイコンを選択</label>
            <div className="avatar-grid">
              {AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  className={`avatar-button ${selectedAvatar === av.id ? 'selected' : ''}`}
                  onClick={() => setSelectedAvatar(av.id)}
                  title={av.label}
                >
                  <span className="avatar-emoji">{av.emoji}</span>
                  <span className="avatar-label">{av.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-button">
            始める
          </button>
        </form>
      </div>
    </div>
  )
}
