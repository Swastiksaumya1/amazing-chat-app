@echo off
echo 🚀 Installing Chat Application Dependencies...
echo.
echo This will install all required packages for both frontend and backend.
echo.

echo Installing root dependencies...
call npm install

echo.
echo Installing backend dependencies...
cd server
call npm install
cd ..

echo.
echo Installing frontend dependencies...
cd client
call npm install
cd ..

echo.
echo ✅ Installation complete!
echo.
echo To start the application, run:
echo   npm run dev
echo.
echo Or double-click start.bat
echo.
pause
