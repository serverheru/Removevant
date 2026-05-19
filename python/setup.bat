@echo off
echo ============================================
echo   Removevant - Python Environment Setup
echo ============================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python tidak ditemukan! Install Python 3.11+ terlebih dahulu.
    echo Download: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [1/4] Membuat virtual environment...
cd /d "%~dp0"
python -m venv venv
if errorlevel 1 (
    echo [ERROR] Gagal membuat virtual environment!
    pause
    exit /b 1
)

echo [2/4] Mengaktifkan virtual environment...
call venv\Scripts\activate.bat

echo [3/4] Menginstall dependencies (ini bisa memakan waktu beberapa menit)...
pip install --upgrade pip
pip install -r requirements.txt

echo [4/4] Pre-download model BiRefNet (first time only)...
python -c "from rembg import new_session; session = new_session('birefnet-general'); print('[OK] Model BiRefNet berhasil di-download!')"

echo.
echo ============================================
echo   Setup selesai! Removevant siap digunakan.
echo ============================================
pause
