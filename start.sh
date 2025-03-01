#!/bin/bash

# Function to kill background processes when script terminates
cleanup() {
  echo "Stopping all processes..."
  kill $(jobs -p) 2>/dev/null
  exit
}

# Set up trap to catch termination signals
trap cleanup SIGINT SIGTERM

# Start backend
cd server
npm install
npm run dev &

cd ../react-app
npm install
npm run dev &

echo "Services started. Press Ctrl+C to stop all processes."
wait