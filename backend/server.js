const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "https://chat-app-frontend.vercel.app"],
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// ルームごとのユーザーデータを管理
const rooms = {
  'room1': { name: 'ゼネラル', users: [] },
  'room2': { name: 'ゲーム', users: [] },
  'room3': { name: 'アニメ', users: [] },
  'room4': { name: '雑談', users: [] }
};

// Socket.io接続処理
io.on('connection', (socket) => {
  console.log('新しいユーザーが接続しました:', socket.id);

  // ユーザーがルームに参加
  socket.on('join_room', (data) => {
    const { username, avatar, roomId } = data;
    
    socket.join(roomId);
    
    // ユーザー情報をルームに保存
    if (rooms[roomId]) {
      rooms[roomId].users.push({
        id: socket.id,
        username,
        avatar
      });
    }

    // ルーム内のすべてのユーザーに通知
    io.to(roomId).emit('user_joined', {
      username,
      avatar,
      users: rooms[roomId]?.users || [],
      message: `${username}さんが入室しました`
    });

    console.log(`${username}が${roomId}に参加しました`);
  });

  // メッセージ受信
  socket.on('send_message', (data) => {
    const { roomId, username, avatar, message } = data;
    
    io.to(roomId).emit('receive_message', {
      username,
      avatar,
      message,
      timestamp: new Date().toLocaleTimeString('ja-JP')
    });
  });

  // ユーザーが切断
  socket.on('disconnect', () => {
    // すべてのルームからユーザーを削除
    for (const roomId in rooms) {
      rooms[roomId].users = rooms[roomId].users.filter(user => user.id !== socket.id);
      
      if (rooms[roomId].users.length > 0) {
        io.to(roomId).emit('user_left', {
          users: rooms[roomId].users
        });
      }
    }
    console.log('ユーザーが切断しました:', socket.id);
  });
});

// REST API: ルーム一覧を取得
app.get('/api/rooms', (req, res) => {
  const roomList = Object.entries(rooms).map(([id, room]) => ({
    id,
    name: room.name,
    userCount: room.users.length
  }));
  res.json(roomList);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました`);
});
