Set WshShell = CreateObject("WScript.Shell")

' Stop old ForgeUI Node processes first
WshShell.Run "cmd /c taskkill /F /IM node.exe >nul 2>&1", 0, True
WshShell.Run "cmd /c taskkill /F /IM npm.cmd >nul 2>&1", 0, True

WScript.Sleep 2000

' Start ForgeUI
WshShell.CurrentDirectory = "C:\ForgeUI\Projects\esp32p4-ui-studio\studio"

WshShell.Run "cmd /c npm run dev", 0, False
WshShell.Run "cmd /c node export-server.js", 0, False

WScript.Sleep 1000

WshShell.Run "http://localhost:3000", 1, False