import { useState, useEffect } from 'react'
import '../styles/RoomListPage.css'

const ROOMS_DATA = [
  { id: 'room1', name: 'ゼネラル', description: '総合的な雑談' },
  { id: 'room2', name: 'ゲーム', description: 'ゲームについて' },
  { id: 'room3', name: 'アニメ', description: 'アニメの話題' },
  { id: 'room4', name: '雑談', description: 'その他の会話' },
]

export default function RoomListPage({ username, onRoomSelect, onBack, apiUrl }) {
  const [rooms, setRooms] = useState(ROOMS_DATA)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${apiUrl}/api/rooms`)
      .then(res => res.json())
      .then(data => {
        const enrichedRooms = ROOMS_DATA.map(room => {
          const backendRoom = data.find(r => r.id === room.id)
          return {
            ...room,
            userCount: backendRoom?.userCount || 0
          }
        })
        setRooms(enrichedRooms)
      })
      .catch(err => console.error('ルーム情報取得エラー:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="room-list-page">
      <div className="room-list-container">
        <div className="room-list-header">
          <div className="header-top">
            <button className="back-button" onClick={onBack}>
              ← 戻る
            </button>
            <h1>チャットルーム</h1>
            <div className="user-info">
              <span>👤 {username}</span>
            </div>
          </div>
          <p className="header-subtitle">入りたいルームを選択してください</p>
        </div>

        {loading ? (
          <div className="loading">読み込み中...</div>
        ) : (
          <div className="rooms-grid">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="room-card"
                onClick={() => onRoomSelect(room.id)}
              >
                <div className="room-card-header">
                  <h2>{room.name}</h2>
                  <span className="user-count">👥 {room.userCount}</span>
                </div>
                <p className="room-description">{room.description}</p>
                <button className="join-button">入室</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
