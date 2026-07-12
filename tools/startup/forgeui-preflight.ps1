param(
    [switch]$Repair
)

$ErrorActionPreference = "SilentlyContinue"

$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$StudioRoot = Join-Path $ProjectRoot "studio"
$FirmwareRoot = Join-Path $ProjectRoot "firmware\ForgeUI-One"
$LvglConverter = Join-Path $ProjectRoot "tools\lvgl\LVGLImage.py"
$PackageJson = Join-Path $StudioRoot "package.json"
$NodeModules = Join-Path $StudioRoot "node_modules"
$ExportServer = Join-Path $StudioRoot "export-server.js"
$EnvFile = Join-Path $StudioRoot ".env.local"

$CriticalFailures = 0
$Warnings = 0

function Write-Section {
    param([string]$Title)

    Write-Host ""
    Write-Host "============================================================" -ForegroundColor DarkCyan
    Write-Host " $Title" -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor DarkCyan
}

function Write-Ok {
    param([string]$Message)
    Write-Host "[OK]      $Message" -ForegroundColor Green
}

function Write-WarningMessage {
    param([string]$Message)

    $script:Warnings++
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Failure {
    param(
        [string]$Message,
        [string]$Fix = ""
    )

    $script:CriticalFailures++

    Write-Host "[ERROR]   $Message" -ForegroundColor Red

    if ($Fix) {
        Write-Host "          Fix: $Fix" -ForegroundColor Gray
    }
}

function Test-CommandAvailable {
    param([string]$Command)

    return $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

function Get-PythonCommand {
    $CommandCandidates = @(
        "py",
        "python",
        "python3"
    )

    foreach ($Candidate in $CommandCandidates) {
        $VersionOutput = & $Candidate --version 2>&1

        if (
            $LASTEXITCODE -eq 0 -and
            "$VersionOutput" -match "^Python\s+\d+\.\d+"
        ) {
            return $Candidate
        }
    }

    $EspressifCandidates = @(
        "C:\Espressif\python_env\idf5.5_py3.11_env\Scripts\python.exe",
        "C:\Espressif\tools\idf-python\3.11.2\python.exe"
    )

    foreach ($Candidate in $EspressifCandidates) {
        if (Test-Path $Candidate) {
            $VersionOutput = & $Candidate --version 2>&1

            if (
                $LASTEXITCODE -eq 0 -and
                "$VersionOutput" -match "^Python\s+\d+\.\d+"
            ) {
                return $Candidate
            }
        }
    }

    $DiscoveredPython = Get-ChildItem `
        "C:\Espressif\python_env" `
        -Recurse `
        -Filter "python.exe" `
        -ErrorAction SilentlyContinue |
        Where-Object {
            $_.FullName -match "\\Scripts\\python\.exe$"
        } |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 1

    if ($DiscoveredPython) {
        $VersionOutput = & $DiscoveredPython.FullName --version 2>&1

        if (
            $LASTEXITCODE -eq 0 -and
            "$VersionOutput" -match "^Python\s+\d+\.\d+"
        ) {
            return $DiscoveredPython.FullName
        }
    }

    return $null
}

function Test-PythonPackage {
    param(
        [string]$PythonCommand,
        [string]$ImportName
    )

    & $PythonCommand -c "import $ImportName" 2>$null
    return $LASTEXITCODE -eq 0
}

function Install-PythonPackage {
    param(
        [string]$PythonCommand,
        [string]$PackageName
    )

    Write-Host "          Installing $PackageName..." -ForegroundColor Cyan
    & $PythonCommand -m pip install $PackageName

    return $LASTEXITCODE -eq 0
}

function Test-PortInUse {
    param([int]$Port)

    $connection = Get-NetTCPConnection `
        -LocalPort $Port `
        -State Listen `
        -ErrorAction SilentlyContinue

    return $null -ne $connection
}

Clear-Host

Write-Host ""
Write-Host "  ______                      _    _ _____ " -ForegroundColor Cyan
Write-Host " |  ____|                    | |  | |_   _|" -ForegroundColor Cyan
Write-Host " | |__ ___  _ __ __ _  ___  | |  | | | |  " -ForegroundColor Cyan
Write-Host " |  __/ _ \| '__/ _`` |/ _ \ | |  | | | |  " -ForegroundColor Cyan
Write-Host " | | | (_) | | | (_| |  __/ | |__| |_| |_ " -ForegroundColor Cyan
Write-Host " |_|  \___/|_|  \__, |\___|  \____/|_____|" -ForegroundColor Cyan
Write-Host "                 __/ |                     " -ForegroundColor Cyan
Write-Host "                |___/                      " -ForegroundColor Cyan

Write-Host ""
Write-Host "ForgeUI Studio Dependency and Installation Check"
Write-Host "Project: $ProjectRoot"

if ($Repair) {
    Write-Host "Mode: CHECK AND REPAIR" -ForegroundColor Yellow
}
else {
    Write-Host "Mode: CHECK ONLY" -ForegroundColor Gray
}

Write-Section "PROJECT STRUCTURE"

if (Test-Path $StudioRoot) {
    Write-Ok "Studio directory found"
}
else {
    Write-Failure `
        "Studio directory is missing" `
        "Confirm this script is inside the ForgeUI project."
}

if (Test-Path $PackageJson) {
    Write-Ok "studio\package.json found"
}
else {
    Write-Failure `
        "studio\package.json is missing" `
        "Restore the complete ForgeUI repository."
}

if (Test-Path $ExportServer) {
    Write-Ok "studio\export-server.js found"
}
else {
    Write-Failure `
        "Export server is missing" `
        "Restore studio\export-server.js from the repository."
}

if (Test-Path $LvglConverter) {
    Write-Ok "LVGLImage.py converter found"
}
else {
    Write-Failure `
        "LVGL image converter is missing" `
        "Restore tools\lvgl\LVGLImage.py."
}

if (Test-Path $FirmwareRoot) {
    Write-Ok "ESP-IDF firmware template found"
}
else {
    Write-Failure `
        "Firmware template is missing" `
        "Restore firmware\ForgeUI-One."
}

Write-Section "NODE.JS AND NPM"

if (Test-CommandAvailable "node") {
    $NodeVersion = node --version
    Write-Ok "Node.js found: $NodeVersion"
}
else {
    Write-Failure `
        "Node.js was not found" `
        "Install Node.js 20 LTS and reopen this window."
}

if (Test-CommandAvailable "npm") {
    $NpmVersion = npm --version
    Write-Ok "npm found: $NpmVersion"
}
else {
    Write-Failure `
        "npm was not found" `
        "Reinstall Node.js with npm enabled."
}

if (Test-Path $NodeModules) {
    Write-Ok "Studio node_modules found"
}
elseif ($Repair -and (Test-CommandAvailable "npm") -and (Test-Path $PackageJson)) {
    Write-WarningMessage "Studio npm packages are not installed"

    Write-Host ""
    Write-Host "Installing Studio dependencies..." -ForegroundColor Cyan

   	 Push-Location $StudioRoot
	npm install --legacy-peer-deps
	$NpmInstallResult = $LASTEXITCODE
	Pop-Location

    if ($NpmInstallResult -eq 0) {
        Write-Ok "Studio npm packages installed"
    }
    else {
        Write-Failure `
            "npm install failed" `
            "Open a terminal in the studio directory and run npm install --legacy-peer-deps."
    }
}
else {
    Write-Failure `
        "Studio npm packages are not installed" `
        "Run FIRST_TIME_FORGEUI_SETUP.bat or run npm install --legacy-peer-deps inside studio."
}

Write-Section "PYTHON IMAGE CONVERTER"

$PythonCommand = Get-PythonCommand

if ($PythonCommand) {
    $PythonVersion = & $PythonCommand --version 2>&1
    Write-Ok "Python found: $PythonVersion"
}
else {
    Write-Failure `
        "Python was not found" `
        "Install Python 3.11 and enable Add Python to PATH."
}

if ($PythonCommand) {
    $PythonPackages = @(
        @{
            Display = "Pillow"
            Import  = "PIL"
            Install = "pillow"
        },
        @{
            Display = "pypng"
            Import  = "png"
            Install = "pypng"
        },
        @{
            Display = "lz4"
            Import  = "lz4"
            Install = "lz4"
        }
    )

    foreach ($Package in $PythonPackages) {
        if (Test-PythonPackage $PythonCommand $Package.Import) {
            Write-Ok "Python package found: $($Package.Display)"
        }
        elseif ($Repair) {
            Write-WarningMessage "Python package missing: $($Package.Display)"

            if (Install-PythonPackage $PythonCommand $Package.Install) {
                Write-Ok "Python package installed: $($Package.Display)"
            }
            else {
                Write-Failure `
                    "Could not install $($Package.Display)" `
                    "$PythonCommand -m pip install $($Package.Install)"
            }
        }
        else {
            Write-Failure `
                "Python package missing: $($Package.Display)" `
                "$PythonCommand -m pip install $($Package.Install)"
        }
    }
}

Write-Section "OPENAI AI PLAYGROUND"

$OpenAiKeyFound = $false

if ($env:OPENAI_API_KEY) {
    $OpenAiKeyFound = $true
    Write-Ok "OPENAI_API_KEY found in the Windows environment"
}

if (Test-Path $EnvFile) {
    $EnvContent = Get-Content $EnvFile -ErrorAction SilentlyContinue

    $KeyLine = $EnvContent |
        Where-Object {
            $_ -match "^\s*OPENAI_API_KEY\s*=\s*.+"
        } |
        Select-Object -First 1

    if ($KeyLine) {
        $KeyValue = ($KeyLine -split "=", 2)[1].Trim()

        if (
            $KeyValue -and
            $KeyValue -notmatch "your[_-]?key" -and
            $KeyValue -notmatch "replace[_-]?me"
        ) {
            $OpenAiKeyFound = $true
            Write-Ok "OpenAI key configured in studio\.env.local"
        }
    }
}

if (-not $OpenAiKeyFound) {
    Write-WarningMessage "OpenAI API key is not configured"

    Write-Host ""
    Write-Host "          ForgeUI Studio can still run." -ForegroundColor Gray
    Write-Host "          AI layout generation will not work until a key is added." -ForegroundColor Gray
    Write-Host ""
    Write-Host "          Create:" -ForegroundColor Gray
    Write-Host "          studio\.env.local" -ForegroundColor White
    Write-Host ""
    Write-Host "          Add:" -ForegroundColor Gray
    Write-Host "          OPENAI_API_KEY=your_key_here" -ForegroundColor White
    Write-Host ""
    Write-Host "          Never commit .env.local to GitHub." -ForegroundColor Yellow
}

if (
    (Test-Path $PackageJson) -and
    (Get-Content $PackageJson -Raw) -match '"openai"'
) {
    Write-Ok "OpenAI npm dependency declared in package.json"
}
else {
    Write-WarningMessage `
        "The OpenAI npm dependency was not detected in package.json"
}

Write-Section "PORTS AND RUNNING SERVICES"

if (Test-PortInUse 3000) {
    Write-WarningMessage "Port 3000 is already in use"
    Write-Host "          ForgeUI Studio or another web server may already be running." -ForegroundColor Gray
}
else {
    Write-Ok "Port 3000 is available"
}

if (Test-PortInUse 3030) {
    Write-WarningMessage "Port 3030 is already in use"
    Write-Host "          ForgeUI export-server may already be running." -ForegroundColor Gray
}
else {
    Write-Ok "Port 3030 is available"
}

Write-Section "ESP-IDF STANDALONE EXPORT SUPPORT"

$EspIdfPath = $null
$EspIdfVersion = $null

# First preference: currently active ESP-IDF environment.
if ($env:IDF_PATH -and (Test-Path $env:IDF_PATH)) {
    $EspIdfPath = $env:IDF_PATH
}

# Otherwise search the standard Espressif installation location.
if (-not $EspIdfPath) {
    $FrameworkRoot = "C:\Espressif\frameworks"

    if (Test-Path $FrameworkRoot) {
        $EspIdfInstall = Get-ChildItem `
            $FrameworkRoot `
            -Directory `
            -ErrorAction SilentlyContinue |
            Where-Object {
                $_.Name -match "esp-idf.*5\.5"
            } |
            Sort-Object LastWriteTime -Descending |
            Select-Object -First 1

        if ($EspIdfInstall) {
            $EspIdfPath = $EspIdfInstall.FullName
        }
    }
}

# Try to read the installed ESP-IDF version.
if ($EspIdfPath) {
    $VersionFile = Join-Path $EspIdfPath "version.txt"

    if (Test-Path $VersionFile) {
        $EspIdfVersion = (
            Get-Content $VersionFile -ErrorAction SilentlyContinue |
            Select-Object -First 1
        ).Trim()
    }

    if (-not $EspIdfVersion) {
        $GitDirectory = Join-Path $EspIdfPath ".git"

        if (
            (Test-Path $GitDirectory) -and
            (Test-CommandAvailable "git")
        ) {
            $EspIdfVersion = & git `
                -C $EspIdfPath `
                describe `
                --tags `
                --always `
                2>$null
        }
    }

    if ($EspIdfVersion) {
        Write-Ok "ESP-IDF installed: $EspIdfVersion"
    }
    else {
        Write-Ok "ESP-IDF 5.5.x installation found"
    }

    Write-Host "          Path: $EspIdfPath" -ForegroundColor Gray

    if ($env:IDF_PATH -or (Test-CommandAvailable "idf.py")) {
        Write-Ok "ESP-IDF build environment is active"
    }
    else {
        Write-Host ""
        Write-Host "[INFO]    ESP-IDF is installed but this shell is not activated." -ForegroundColor Cyan
        Write-Host "          Open an ESP-IDF PowerShell or use the ESP-IDF VS Code extension" -ForegroundColor Gray
        Write-Host "          before building or flashing a standalone export." -ForegroundColor Gray
    }

    Write-Host ""
    Write-Host "          Standalone export workflow available:" -ForegroundColor Green
    Write-Host "            ForgeUI Studio" -ForegroundColor Gray
    Write-Host "                -> Export ESP-IDF Project" -ForegroundColor Gray
    Write-Host "                -> Open exported project independently" -ForegroundColor Gray
    Write-Host "                -> Add custom I/O and application code" -ForegroundColor Gray
    Write-Host "                -> Build and flash without ForgeUI Studio" -ForegroundColor Gray
}
else {
    Write-WarningMessage "ESP-IDF 5.5.x installation was not found"

    Write-Host ""
    Write-Host "          ForgeUI Studio can still:" -ForegroundColor Gray
    Write-Host "            - Run the browser editor" -ForegroundColor Gray
    Write-Host "            - Generate AI layouts" -ForegroundColor Gray
    Write-Host "            - Convert image assets" -ForegroundColor Gray
    Write-Host "            - Generate a standalone project export" -ForegroundColor Gray
    Write-Host ""
    Write-Host "          ESP-IDF 5.5.x is required to:" -ForegroundColor Yellow
    Write-Host "            - Build the exported project" -ForegroundColor Gray
    Write-Host "            - Flash physical ESP32-P4 hardware" -ForegroundColor Gray
    Write-Host "            - Continue development independently of ForgeUI Studio" -ForegroundColor Gray
    Write-Host "            - Add custom I/O, drivers and application logic" -ForegroundColor Gray
    Write-Host ""
    Write-Host "          Install ESP-IDF 5.5.x using Espressif's installer or" -ForegroundColor Gray
    Write-Host "          configure the ESP-IDF extension in Visual Studio Code." -ForegroundColor Gray
}

Write-Section "RESULT"

if ($CriticalFailures -eq 0) {
    Write-Host ""
    Write-Host "FORGEUI PREFLIGHT PASSED" -ForegroundColor Green
    Write-Host ""
    Write-Host "Warnings: $Warnings" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "ForgeUI Studio has the required dependencies to start." -ForegroundColor Green

    if ($Repair) {
        Write-Host ""
        $StartForgeUI = Read-Host "Start ForgeUI Studio now? [Y/N]"

        if ($StartForgeUI -match "^[Yy]") {
            $Starter = Join-Path $ProjectRoot "START_FORGEUI_STUDIO_HIDDEN.vbs"

            if (Test-Path $Starter) {
                Start-Process "wscript.exe" -ArgumentList "`"$Starter`""
                Write-Host "ForgeUI Studio startup requested." -ForegroundColor Green
            }
            else {
                Write-WarningMessage `
                    "START_FORGEUI_STUDIO_HIDDEN.vbs was not found"
            }
        }
    }

    exit 0
}

Write-Host ""
Write-Host "FORGEUI PREFLIGHT FAILED" -ForegroundColor Red
Write-Host ""
Write-Host "Critical errors: $CriticalFailures" -ForegroundColor Red
Write-Host "Warnings:        $Warnings" -ForegroundColor Yellow
Write-Host ""
Write-Host "Review the repair instructions above." -ForegroundColor White
Write-Host "ForgeUI Studio was not started." -ForegroundColor White

exit 1