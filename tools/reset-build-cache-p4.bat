@echo off
setlocal

echo =========================================
echo ESP32-P4 HARD RESET Build Cache
echo =========================================

set PROJECT_DIR=C:\ForgeUI\Projects\esp32p4-ui-studio\firmware\ForgeUI-One

echo.
echo Project:
echo %PROJECT_DIR%

echo.
echo Deleting build cache...

if exist "%PROJECT_DIR%\build" (
  rmdir /s /q "%PROJECT_DIR%\build"
  echo Deleted build
) else (
  echo build not found
)

if exist "%PROJECT_DIR%\managed_components" (
  rmdir /s /q "%PROJECT_DIR%\managed_components"
  echo Deleted managed_components
) else (
  echo managed_components not found
)

if exist "%PROJECT_DIR%\dependencies.lock" (
  del /f /q "%PROJECT_DIR%\dependencies.lock"
  echo Deleted dependencies.lock
) else (
  echo dependencies.lock not found
)

echo.
echo =========================================
echo RESET COMPLETE
echo =========================================
echo.
echo Now run Clean Build ^& Flash in Studio
echo or run:
echo idf.py set-target esp32p4
echo idf.py build flash
echo.

pause
endlocal