@echo off
setlocal
chcp 65001 >nul
set PYTHONIOENCODING=utf-8

echo =========================================
echo ESP32-P4 UI Studio SAFE Build / Flash
echo =========================================
echo.

set "PROJECT_DIR=C:\ForgeUI\esp32p4-ui-studio\firmware\ForgeUI-One"
set "IDF_EXPORT=C:\Espressif\frameworks\esp-idf-v5.5.4\export.bat"
set "IDF_PYTHON_ENV_PATH=C:\Espressif\python_env\idf5.5_py3.11_env"

if not exist "%IDF_PYTHON_ENV_PATH%\Scripts\python.exe" (
    echo ERROR: ESP-IDF Python environment not found:
    echo %IDF_PYTHON_ENV_PATH%
    exit /b 1
)

set "PATH=%IDF_PYTHON_ENV_PATH%\Scripts;%PATH%"

if not exist "%IDF_EXPORT%" (
    echo ERROR: ESP-IDF export script not found:
    echo %IDF_EXPORT%
    exit /b 1
)

call "%IDF_EXPORT%"
if errorlevel 1 (
    echo ERROR: ESP-IDF activation failed.
    exit /b 1
)

if not exist "%PROJECT_DIR%\CMakeLists.txt" (
    echo ERROR: Firmware CMakeLists.txt not found:
    echo %PROJECT_DIR%\CMakeLists.txt
    exit /b 1
)

cd /d "%PROJECT_DIR%"
if errorlevel 1 (
    echo ERROR: Could not enter firmware directory:
    echo %PROJECT_DIR%
    exit /b 1
)

python --version
if errorlevel 1 exit /b 1

idf.py --version
if errorlevel 1 exit /b 1

echo.
echo =========================================
echo BUILD / FLASH
echo =========================================
echo.

idf.py build flash
if errorlevel 1 (
    echo.
    echo =========================================
    echo BUILD / FLASH FAILED
    echo =========================================
    exit /b 1
)

echo.
echo =========================================
echo BUILD / FLASH COMPLETE
echo =========================================
echo.

exit /b 0