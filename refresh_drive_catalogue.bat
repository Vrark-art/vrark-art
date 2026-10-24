@echo off
cd /d "%~dp0"
py refresh_drive_catalogue.py
if errorlevel 1 (
  echo.
  echo Catalogue refresh failed. Check the message above.
)
pause
