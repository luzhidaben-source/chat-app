#!/bin/bash

echo "=========================================="
echo "Chat App - サーバー起動スクリプト"
echo "=========================================="
echo ""

# OSの判定
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
  # Windows
  echo "Windows 環境を検出しました"
  echo ""
  echo "以下の2つのターミナルを別々に開いてください："
  echo ""
  echo "【ターミナル1】バックエンド起動："
  echo "  cd backend"
  echo "  npm start"
  echo ""
  echo "【ターミナル2】フロントエンド起動："
  echo "  cd frontend"
  echo "  npm run dev"
  echo ""
else
  # Mac/Linux
  echo "Mac/Linux 環境を検出しました"
  echo ""
  echo "バックエンドとフロントエンドを同時起動します..."
  echo ""
  
  # バックエンド起動（バックグラウンド）
  cd backend
  npm start &
  BACKEND_PID=$!
  cd ..
  
  sleep 2
  
  # フロントエンド起動
  cd frontend
  npm run dev &
  FRONTEND_PID=$!
  cd ..
  
  echo ""
  echo "✅ サーバーが起動しました！"
  echo "ブラウザで http://localhost:5173 を開いてください"
  echo ""
  echo "終了するには Ctrl+C を押してください"
  
  # プロセス待機
  wait $BACKEND_PID $FRONTEND_PID
fi
