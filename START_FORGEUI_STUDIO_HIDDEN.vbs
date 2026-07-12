Option Explicit

Dim WshShell
Dim FileSystem
Dim ScriptDirectory
Dim StudioDirectory

Set WshShell = CreateObject("WScript.Shell")
Set FileSystem = CreateObject("Scripting.FileSystemObject")

ScriptDirectory = FileSystem.GetParentFolderName(WScript.ScriptFullName)
StudioDirectory = FileSystem.BuildPath(ScriptDirectory, "studio")

If Not FileSystem.FolderExists(StudioDirectory) Then
    MsgBox _
        "ForgeUI Studio could not be found." & vbCrLf & vbCrLf & _
        "Expected directory:" & vbCrLf & _
        StudioDirectory & vbCrLf & vbCrLf & _
        "Run CHECK_FORGEUI_INSTALL.bat for diagnostics.", _
        vbCritical, _
        "ForgeUI Studio"
        
    WScript.Quit 1
End If

' Stop old ForgeUI Node processes first.
WshShell.Run _
    "cmd /c taskkill /F /IM node.exe >nul 2>&1", _
    0, _
    True

WshShell.Run _
    "cmd /c taskkill /F /IM npm.cmd >nul 2>&1", _
    0, _
    True

WScript.Sleep 2000

WshShell.CurrentDirectory = StudioDirectory

' Start the ForgeUI browser editor.
WshShell.Run _
    "cmd /c npm run dev", _
    0, _
    False

' Start the local export, conversion and hardware bridge.
WshShell.Run _
    "cmd /c node export-server.js", _
    0, _
    False

' Allow the servers time to begin starting.
WScript.Sleep 2000

WshShell.Run _
    "http://localhost:3000", _
    1, _
    False