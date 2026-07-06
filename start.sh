#!/bin/bash
# setup.sh - Setup script for Restaurant Forel

echo "🍽️  Restaurant Forel Setup Script"
echo "================================"

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node -v)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check if .env exists
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env file and set your ADMIN_TOKEN"
    echo "   Default admin token is: admin123"
fi

# Create required directories
echo ""
echo "📁 Creating required directories..."
mkdir -p uploads/menu
mkdir -p server/data
echo "✅ Directories created"

# Create run script
echo ""
echo "📝 Creating run script..."
cat > run.sh << 'EOF'
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
EOF

chmod +x run.sh

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the application, run:"
echo "   ./run.sh"
echo ""
echo "Or start servers manually:"
echo "   Terminal 1: node server/index.js"
echo "   Terminal 2: npm run dev"
echo ""
echo "📌 Important URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Admin: http://localhost:3000/admin"
echo "   Admin Token: Check your .env file"