@echo off

echo =========================================
echo ESP32-P4 UI Studio CLEAN Build / Flash / Monitor
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
echo FULL CLEAN
echo =========================================
echo.

idf.py fullclean

echo.
echo =========================================
echo BUILD / FLASH / MONITOR
echo =========================================
echo.

idf.py build flash monitor

echo.
echo =========================================
echo DONE OR FAILED
echo =========================================
pause