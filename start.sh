#!/bin/bash

echo "Starting Video Streaming Application..."
echo

echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install backend dependencies"
    exit 1
fi

echo
echo "Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install frontend dependencies"
    exit 1
fi

echo
echo "Starting backend server..."
cd ../backend
npm start &
BACKEND_PID=$!

echo
echo "Waiting for backend to start..."
sleep 3

echo "Starting frontend development server..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo
echo "Application is starting..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo
echo "Press Ctrl+C to stop all servers"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
