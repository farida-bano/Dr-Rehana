#!/bin/bash

# Simple run script for MCQ Quiz System

echo "🤖 AI Agent Factory - MCQ Quiz System"
echo "======================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3."
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "✅ Activating virtual environment..."
source venv/bin/activate

# Install requirements
echo "📚 Installing dependencies..."
pip install -q -r requirements.txt

# Run the app
echo ""
echo "🚀 Starting server..."
echo ""
echo "📍 Quiz: http://localhost:5000"
echo "📊 Results: http://localhost:5000/results"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python app.py
