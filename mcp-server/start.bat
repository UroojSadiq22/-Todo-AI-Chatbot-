@echo off
REM MCP Server Startup Script (Windows)

echo Starting MCP Server...

REM Check if .env file exists
if not exist .env (
    echo Error: .env file not found
    echo Please copy .env.example to .env and configure your database connection
    exit /b 1
)

REM Check if DATABASE_URL is set (basic check)
findstr /C:"DATABASE_URL=" .env >nul
if errorlevel 1 (
    echo Error: DATABASE_URL not found in .env file
    exit /b 1
)

REM Get port from environment or default to 5000
if not defined MCP_SERVER_PORT set MCP_SERVER_PORT=5000

REM Start the server
echo Starting MCP Server on port %MCP_SERVER_PORT%...
cd src
uvicorn main:app --host 0.0.0.0 --port %MCP_SERVER_PORT% --reload
