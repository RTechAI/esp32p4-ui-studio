@echo off
chcp 65001 >nul
set PYTHONIOENCODING=utf-8

echo =========================================
echo ESP32-P4 UI Studio SAFE Build / Flash
echo =========================================
echo.

set IDF_PYTHON_ENV_PATH=C:\Espressif\python_env\idf5.5_py3.11_env
set PATH=%IDF_PYTHON_ENV_PATH%\Scripts;%PATH%

call C:\Espressif\frameworks\esp-idf-v5.5.4\export.bat

cd /d C:\ForgeUI\Projects\esp32p4-ui-studio\firmware\ForgeUI-One

python --version
idf.py --version

echo.
echo =========================================
echo REPAIR ESP-IDF MANAGED COMPONENT CACHE
echo =========================================
echo.

if exist managed_components rmdir /s /q managed_components
if exist dependencies.lock del /q dependencies.lock

echo.
echo =========================================
echo BUILD / FLASH
echo =========================================
echo.

idf.py build flash

echo.
echo =========================================
echo DONE
echo =========================================
echo.