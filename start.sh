#!/bin/bash

# EduMaster LMS - Quick Start Script
# This script helps you set up and run the application quickly

echo "🚀 EduMaster LMS - Quick Start"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Check if MongoDB is running
if command -v mongosh &> /dev/null; then
    echo "🔍 Checking MongoDB..."
    if mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is not running. Starting MongoDB..."
        if command -v brew &> /dev/null; then
            brew services start mongodb-community
            sleep 2
        else
            echo "⚠️  Please start MongoDB manually:"
            echo "   mongod --config /usr/local/etc/mongod.conf"
        fi
    fi
else
    echo "⚠️  MongoDB CLI not found. Make sure MongoDB is installed and running."
fi

echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.example .env.local
    echo "✅ .env.local created. Please update with your configuration."
    echo ""
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
fi

echo "🎯 Starting EduMaster LMS..."
echo ""
echo "Frontend will be available at: http://localhost:3000"
echo "Backend API will be available at: http://localhost:4000"
echo ""
echo "Press Ctrl+C to stop the servers"
echo ""

# Start both servers
npm run dev:all
