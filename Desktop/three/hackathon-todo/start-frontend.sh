#!/bin/bash

# Navigate to the frontend directory
cd /Users/sarosh/Desktop/three/hackathon-todo/frontend

# Install dependencies using yarn (faster than npm in many cases)
if command -v yarn &> /dev/null; then
    echo "Using yarn to install dependencies..."
    yarn install
else
    echo "Yarn not found, trying npm..."
    npm install
fi

# Start the development server
if command -v yarn &> /dev/null; then
    echo "Starting frontend with yarn..."
    yarn dev
else
    echo "Starting frontend with npm..."
    npm run dev
fi