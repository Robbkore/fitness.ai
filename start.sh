#!/bin/bash

# Trap SIGINT to kill background processes on exit
trap 'kill 0' SIGINT

echo "Starting Fitness.ai..."

# Start Backend
echo "Starting Backend (Go)..."
(cd backend && go run main.go) &

# Start Frontend
echo "Starting Frontend (Vite)..."
(cd frontend && npm run dev) &

# Wait for processes
wait
