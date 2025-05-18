@echo off
start cmd /k "cd server && npm start"
timeout /t 5
start cmd /k "cd client && npm start" 