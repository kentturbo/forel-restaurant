#!/bin/bash
echo "🚀 Starting Restaurant Forel..."
echo ""
echo "📡 Starting backend server on port 5000..."
node server/index.js &
BACKEND_PID=$!

echo "⏳ Waiting for backend to start..."
sleep 3

echo "🌐 Starting frontend on port 3000..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Restaurant Forel is running!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "📡 Backend API: http://localhost:5000"
echo "👤 Admin Panel: http://localhost:3000/admin"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to kill both processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup INT TERM

# Keep script running
wait
