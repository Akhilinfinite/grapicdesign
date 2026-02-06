@echo off

net session >nul 2>&1

if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else (
	goto gotAdmin
)

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    set params= %*
    echo UAC.ShellExecute "cmd.exe", "/c ""%~s0"" %params:"=""%", "", "runas", 1 >> "%temp%\getadmin.vbs"

    "%temp%\getadmin.vbs"
    del "%temp%\getadmin.vbs"
    exit /B
:gotAdmin

for /F "tokens=3 delims=: " %%H in ('sc query "FlexmonsterDataServer" ^| findstr "STATE"') do (
  if /I "%%H" EQU "RUNNING" (
   sc stop FlexmonsterDataServer
  )
  timeout /t 5 /nobreak > NUL
  sc delete FlexmonsterDataServer
)
sc create FlexmonsterDataServer binPath= "%~dp0flexmonster-data-server.exe --service --homedir %~dp0"
sc failure FlexmonsterDataServer actions= restart/60000/restart/60000/""/60000 reset= 86400
sc start FlexmonsterDataServer
sc config FlexmonsterDataServer start=delayed-auto
