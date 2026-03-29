@echo off
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo Starting server at http://localhost:3000
call npm start
pause