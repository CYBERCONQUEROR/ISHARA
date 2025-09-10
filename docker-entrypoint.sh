#!/bin/sh

# Activate Python virtual environment
source /app/venv/bin/activate

# Start backend in background
echo "Starting backend server..."
cd /app && python -m uvicorn backend.main:app --host 0.0.0.0 --port 8001 &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 5

# Start frontend
echo "Starting frontend server..."
cd /app && npm run dev -- --host 0.0.0.0 --port 3000 &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID 