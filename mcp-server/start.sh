#!/bin/bash
# MCP Server Startup Script (Linux/Mac)

echo "Starting MCP Server..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found"
    echo "Please copy .env.example to .env and configure your database connection"
    exit 1
fi

# Load environment variables
source .env

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL not set in .env file"
    exit 1
fi

# Get port from environment or default to 5000
PORT=${MCP_SERVER_PORT:-5000}

# Start the server
echo "Starting MCP Server on port $PORT..."
cd src && uvicorn main:app --host 0.0.0.0 --port $PORT --reload
