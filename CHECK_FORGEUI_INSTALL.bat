@echo off
setlocal

cd /d "%~dp0"

title ForgeUI Studio - Installation Check

powershell.exe -NoProfile -ExecutionPolicy Bypass ^
  -File "%~dp0tools\startup\forgeui-preflight.ps1"

echo.
pause
endlocal