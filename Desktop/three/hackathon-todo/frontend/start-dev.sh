#!/bin/bash

# Navigate to the frontend directory
cd /Users/sarosh/Desktop/three/hackathon-todo/frontend

echo "Installing dependencies..."
npm install

echo "Starting Next.js development server..."
npx next dev -p 3000