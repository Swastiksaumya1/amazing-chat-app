@echo off
echo Installing test dependencies...
call npm install --save-dev axios ws

echo.
echo Running API tests...
node test-api.js

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Tests failed with error code %ERRORLEVEL%
    exit /b %ERRORLEVEL%
)

echo.
echo All tests completed successfully!
pause
