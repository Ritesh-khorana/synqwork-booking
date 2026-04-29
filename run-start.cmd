@echo off
setlocal
set "ROOT=%~dp0"
cd /d "%ROOT%"

set "PATH=%ROOT%.tools\node;%PATH%"

call "%ROOT%.tools\node\npm.cmd" run start
