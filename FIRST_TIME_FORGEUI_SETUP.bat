@echo off
setlocal

cd /d "%~dp0"

title ForgeUI Studio - First Time Setup

echo.
echo ============================================================
echo               FORGEUI STUDIO FIRST TIME SETUP
echo ============================================================
echo.
echo This checks ForgeUI dependencies and offers safe repairs.
echo.
echo It may install:
echo   - Studio npm packages
echo   - Pillow
echo   - pypng
echo   - lz4
echo.
echo It will NOT automatically install:
echo   - Node.js
echo   - Python
echo   - ESP-IDF
echo   - USB drivers
echo.
pause

powershell.exe -NoProfile -ExecutionPolicy Bypass ^
  -File "%~dp0tools\startup\forgeui-preflight.ps1" ^
  -Repair

echo.
pause
endlocal