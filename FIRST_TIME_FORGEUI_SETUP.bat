@echo off
setlocal

cd /d "%~dp0"

title ForgeUI Studio - First Time Setup

echo.
echo ============================================================
echo               FORGEUI STUDIO FIRST TIME SETUP
echo ============================================================
echo.
echo This tool verifies your ForgeUI Studio installation and
echo automatically repairs project dependencies where possible.
echo.
echo It checks:
echo   - Project structure
echo   - Node.js and npm
echo   - Python
echo   - ESP-IDF
echo   - OpenAI configuration
echo   - Required network ports
echo.
echo It may automatically install or repair:
echo   - Studio npm packages
echo   - Pillow
echo   - pypng
echo   - lz4
echo.
echo The following must already be installed:
echo   - Git for Windows
echo   - Node.js 20 LTS
echo   - Python 3.11 (or ESP-IDF bundled Python)
echo   - ESP-IDF 5.5.x
echo.
echo If any required software is missing,
echo this tool will explain exactly how to install it.
echo.
pause

powershell.exe -NoProfile -ExecutionPolicy Bypass ^
  -File "%~dp0tools\startup\forgeui-preflight.ps1" ^
  -Repair

echo.
pause
endlocal