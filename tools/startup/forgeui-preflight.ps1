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
$NextBuildId = Join-Path $StudioRoot ".next\BUILD_ID"

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

function Write-Info {
    param([string]$Message)

    Write-Host "[INFO]    $Message" -ForegroundColor Cyan
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

    return $null -ne (
        Get-Command $Command -ErrorAction SilentlyContinue
    )
}

function Get-CommandPath {
    param([string]$Command)

    $ResolvedCommand = Get-Command `
        $Command `
        -ErrorAction SilentlyContinue

    if ($ResolvedCommand) {
        return $ResolvedCommand.Source
    }

    return $null
}

function Refresh-ProcessPath {
    $MachinePath = [Environment]::GetEnvironmentVariable(
        "Path",
        "Machine"
    )

    $UserPath = [Environment]::GetEnvironmentVariable(
        "Path",
        "User"
    )

    $PathParts = @()

    if ($MachinePath) {
        $PathParts += $MachinePath
    }

    if ($UserPath) {
        $PathParts += $UserPath
    }

    if ($PathParts.Count -gt 0) {
        $env:Path = $PathParts -join ";"
    }
}

function Install-NodeJs20WithWinget {
    if (-not (Test-CommandAvailable "winget")) {
        return $false
    }

    Write-Host ""
    Write-Host "Installing Node.js 20 using Windows Package Manager..." -ForegroundColor Cyan
    Write-Host ""

    & winget install `
        --id OpenJS.NodeJS.20 `
        --exact `
        --source winget `
        --architecture x64 `
        --accept-package-agreements `
        --accept-source-agreements `
        --disable-interactivity

    $InstallResult = $LASTEXITCODE

    if ($InstallResult -ne 0) {
        return $false
    }

    Refresh-ProcessPath
    Start-Sleep -Seconds 3

    return (
        (Test-CommandAvailable "node") -and
        (Test-CommandAvailable "npm")
    )
}

function Test-VcRedistX64Installed {
    $RegistryPaths = @(
        "HKLM:\SOFTWARE\Microsoft\VisualStudio\14.0\VC\Runtimes\x64",
        "HKLM:\SOFTWARE\WOW6432Node\Microsoft\VisualStudio\14.0\VC\Runtimes\x64"
    )

    foreach ($RegistryPath in $RegistryPaths) {
        if (Test-Path $RegistryPath) {
            $Runtime = Get-ItemProperty `
                $RegistryPath `
                -ErrorAction SilentlyContinue

            if (
                $Runtime -and
                $Runtime.Installed -eq 1
            ) {
                return $true
            }
        }
    }

    return $false
}

function Install-VcRedistX64WithWinget {
    if (-not (Test-CommandAvailable "winget")) {
        return $false
    }

    Write-Host ""
    Write-Host "Installing Microsoft Visual C++ 2015-2022 Redistributable (x64)..." -ForegroundColor Cyan
    Write-Host ""

    & winget install `
        --id Microsoft.VCRedist.2015+.x64 `
        --exact `
        --source winget `
        --architecture x64 `
        --accept-package-agreements `
        --accept-source-agreements `
        --disable-interactivity

    $InstallResult = $LASTEXITCODE

    if ($InstallResult -ne 0) {
        return $false
    }

    Start-Sleep -Seconds 2

    return Test-VcRedistX64Installed
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
        $VersionOutput = `
            & $DiscoveredPython.FullName --version 2>&1

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

    Write-Host `
        "          Installing $PackageName..." `
        -ForegroundColor Cyan

    & $PythonCommand -m pip install $PackageName

    return $LASTEXITCODE -eq 0
}

function Test-PortInUse {
    param([int]$Port)

    $Connection = Get-NetTCPConnection `
        -LocalPort $Port `
        -State Listen `
        -ErrorAction SilentlyContinue

    return $null -ne $Connection
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

Write-Section "WINDOWS C++ RUNTIME"

$VcRedistInstalled = Test-VcRedistX64Installed

if ($VcRedistInstalled) {
    Write-Ok "Microsoft Visual C++ 2015-2022 Redistributable (x64) found"
}
elseif ($Repair) {
    Write-WarningMessage `
        "Microsoft Visual C++ 2015-2022 Redistributable (x64) was not found"

    Write-Host ""
    Write-Host "          ForgeUI needs this Windows runtime for the Next.js SWC compiler." -ForegroundColor Gray
    Write-Host ""

    if (Test-CommandAvailable "winget") {
        $InstallVcRedist = Read-Host "Install the required Microsoft C++ runtime now? [Y/N]"

        if ($InstallVcRedist -match "^[Yy]") {
            if (Install-VcRedistX64WithWinget) {
                Write-Ok "Microsoft Visual C++ runtime installed successfully"
                $VcRedistInstalled = $true
            }
            else {
                Write-Failure `
                    "Automatic Microsoft Visual C++ runtime installation failed" `
                    "Run winget install --id Microsoft.VCRedist.2015+.x64 --exact and rerun setup."
            }
        }
        else {
            Write-Failure `
                "Microsoft Visual C++ runtime installation was declined" `
                "Install Microsoft.VCRedist.2015+.x64 and rerun setup."
        }
    }
    else {
        Write-Failure `
            "Microsoft Visual C++ runtime was not found and WinGet is unavailable" `
            "Install the Microsoft Visual C++ 2015-2022 Redistributable (x64), then rerun setup."
    }
}
else {
    Write-Failure `
        "Microsoft Visual C++ 2015-2022 Redistributable (x64) was not found" `
        "Run FIRST_TIME_FORGEUI_SETUP.bat to install it automatically."
}

Write-Section "NODE.JS AND NPM"

$NodeAvailable = Test-CommandAvailable "node"
$NpmAvailable = Test-CommandAvailable "npm"
$NodeWasInstalled = $false
$NodeVersionChanged = $false
$ForceStudioDependencyRefresh = $false

if ($NodeAvailable) {
    $ExistingNodeVersion = node --version
    $ExistingNodeMajorVersion = $null

    if ("$ExistingNodeVersion" -match "^v(\d+)") {
        $ExistingNodeMajorVersion = [int]$Matches[1]
    }

    if ($ExistingNodeMajorVersion -ne 20) {
        Write-WarningMessage `
            "Unsupported Node.js version detected: $ExistingNodeVersion"

        Write-Host ""
        Write-Host "          ForgeUI currently requires Node.js 20.x." -ForegroundColor Yellow
        Write-Host "          Other major versions may fail to load the Next.js SWC binary." -ForegroundColor Gray

        if ($Repair -and (Test-CommandAvailable "winget")) {
            Write-Host ""
            $ReplaceNode = Read-Host "Replace the installed Node.js version with Node.js 20 now? [Y/N]"

            if ($ReplaceNode -match "^[Yy]") {
                Write-Host ""
                Write-Host "Removing the unsupported Node.js installation..." -ForegroundColor Cyan

                & winget uninstall `
                    --id OpenJS.NodeJS.LTS `
                    --exact `
                    --source winget `
                    --disable-interactivity `
                    2>$null

                & winget uninstall `
                    --id OpenJS.NodeJS `
                    --exact `
                    --source winget `
                    --disable-interactivity `
                    2>$null

                & winget uninstall `
                    --id OpenJS.NodeJS.20 `
                    --exact `
                    --source winget `
                    --disable-interactivity `
                    2>$null

                Refresh-ProcessPath
                Start-Sleep -Seconds 2

                if (Install-NodeJs20WithWinget) {
                    Write-Ok "Node.js 20 and npm installed successfully"
                    $NodeAvailable = Test-CommandAvailable "node"
                    $NpmAvailable = Test-CommandAvailable "npm"
                    $NodeVersionChanged = $true
                    $ForceStudioDependencyRefresh = $true
                }
                else {
                    Write-Failure `
                        "Automatic Node.js 20 installation failed" `
                        "Run: winget install --id OpenJS.NodeJS.20 --exact, or install Node.js 20 manually."
                    $NodeAvailable = $false
                    $NpmAvailable = $false
                }
            }
            else {
                Write-Failure `
                    "Unsupported Node.js version was not replaced" `
                    "Install Node.js 20.x and rerun FIRST_TIME_FORGEUI_SETUP.bat."
            }
        }
        else {
            Write-Failure `
                "ForgeUI requires Node.js 20.x" `
                "Install Node.js 20.x and rerun FIRST_TIME_FORGEUI_SETUP.bat."
        }
    }
}

if (
    (-not $NodeAvailable) -and
    $Repair
) {
    Write-WarningMessage "Node.js was not found"

    if (Test-CommandAvailable "winget") {
        Write-Host ""
        Write-Host "          ForgeUI can install the supported Node.js 20 release" -ForegroundColor Gray
        Write-Host "          using Windows Package Manager." -ForegroundColor Gray
        Write-Host ""

        $InstallNode = Read-Host "Install Node.js 20 now? [Y/N]"

        if ($InstallNode -match "^[Yy]") {
            if (Install-NodeJs20WithWinget) {
                Write-Ok "Node.js 20 and npm installed successfully"

                $NodeAvailable = Test-CommandAvailable "node"
                $NpmAvailable = Test-CommandAvailable "npm"
                $NodeWasInstalled = $true
                $ForceStudioDependencyRefresh = $true
            }
            else {
                Write-Failure `
                    "Automatic Node.js 20 installation failed" `
                    "Install Node.js 20 manually and rerun FIRST_TIME_FORGEUI_SETUP.bat."
            }
        }
        else {
            Write-Failure `
                "Node.js installation was declined" `
                "Install Node.js 20.x and rerun FIRST_TIME_FORGEUI_SETUP.bat."
        }
    }
    else {
        Write-Failure "Node.js was not found"

        Write-Host ""
        Write-Host "          Windows Package Manager was not detected." -ForegroundColor Gray
        Write-Host ""
        Write-Host "          Install Node.js 20 manually:" -ForegroundColor Gray
        Write-Host "          https://nodejs.org/download/release/latest-v20.x/" -ForegroundColor White
        Write-Host ""
        Write-Host "          Keep these options enabled:" -ForegroundColor Gray
        Write-Host "            - npm package manager" -ForegroundColor White
        Write-Host "            - Add Node.js to PATH" -ForegroundColor White
    }
}

if ($NodeAvailable) {
    $NodeVersion = node --version
    $NodePath = Get-CommandPath "node"
    $NodeMajorVersion = $null

    Write-Ok "Node.js found: $NodeVersion"

    if ($NodePath) {
        Write-Host "          Path: $NodePath" -ForegroundColor Gray
    }

    if ("$NodeVersion" -match "^v(\d+)") {
        $NodeMajorVersion = [int]$Matches[1]
    }

    if ($NodeMajorVersion -eq 20) {
        Write-Ok "Supported Node.js 20 version detected"
    }
    elseif ($NodeMajorVersion) {
        Write-Failure `
            "Unsupported Node.js major version: $NodeMajorVersion" `
            "ForgeUI currently requires Node.js 20.x."
    }
    else {
        Write-Failure `
            "The installed Node.js version could not be identified" `
            "Install Node.js 20.x."
    }
}
elseif (-not $Repair) {
    Write-Failure `
        "Node.js was not found" `
        "Run FIRST_TIME_FORGEUI_SETUP.bat to install Node.js 20."
}

$NpmAvailable = Test-CommandAvailable "npm"

if ($NpmAvailable) {
    $NpmVersion = npm --version
    $NpmPath = Get-CommandPath "npm"

    Write-Ok "npm found: $NpmVersion"

    if ($NpmPath) {
        Write-Host "          Path: $NpmPath" -ForegroundColor Gray
    }
}
elseif ($NodeAvailable) {
    Write-Failure `
        "npm was not found" `
        "Reinstall Node.js 20 with the npm package manager enabled."
}
elseif (-not $Repair) {
    Write-Failure `
        "npm was not found" `
        "Run FIRST_TIME_FORGEUI_SETUP.bat to install Node.js 20 and npm."
}

if (
    $ForceStudioDependencyRefresh -and
    $Repair
) {
    Write-Host ""
    Write-Host "Refreshing Studio dependencies for Node.js 20..." -ForegroundColor Cyan

    if (Test-Path $NodeModules) {
        Remove-Item `
            $NodeModules `
            -Recurse `
            -Force `
            -ErrorAction SilentlyContinue
    }

    $NextBuildDirectory = Join-Path $StudioRoot ".next"

    if (Test-Path $NextBuildDirectory) {
        Remove-Item `
            $NextBuildDirectory `
            -Recurse `
            -Force `
            -ErrorAction SilentlyContinue
    }
}

if (
    (Test-Path $NodeModules) -and
    (-not $ForceStudioDependencyRefresh) -and
    $NodeAvailable -and
    $NpmAvailable
) {
    Write-Ok "Studio node_modules found"
}
elseif (
    $Repair -and
    $NpmAvailable -and
    $VcRedistInstalled -and
    (Test-Path $PackageJson)
) {
    Write-Host ""
    Write-Host "Installing Studio dependencies..." -ForegroundColor Cyan

    Push-Location $StudioRoot

    & npm install `
        --legacy-peer-deps `
        --include=optional

    $NpmInstallResult = $LASTEXITCODE

    Pop-Location

    if ($NpmInstallResult -eq 0) {
        Write-Ok "Studio npm packages installed"
    }
    else {
        Write-Failure `
            "npm install failed" `
            "Run npm install --legacy-peer-deps --include=optional inside studio."
    }
}
elseif (-not $NpmAvailable) {
    Write-Info `
        "Studio npm package installation is waiting for Node.js 20 and npm"
}
elseif (-not $VcRedistInstalled) {
    Write-Info `
        "Studio npm package installation is waiting for the Microsoft C++ runtime"
}
else {
    Write-Failure `
        "Studio npm packages are not installed" `
        "Run FIRST_TIME_FORGEUI_SETUP.bat or install them inside studio."
}

if (
    $Repair -and
    $NpmAvailable -and
    $VcRedistInstalled -and
    (Test-Path $NodeModules) -and
    (Test-Path $PackageJson)
) {
    if (Test-Path $NextBuildId) {
        Write-Ok "ForgeUI production build found"
    }
    else {
        Write-Host ""
        Write-Host "Building ForgeUI Studio for first use..." -ForegroundColor Cyan

        Push-Location $StudioRoot

        & npm run build

        $BuildResult = $LASTEXITCODE

        Pop-Location

        if (
            $BuildResult -eq 0 -and
            (Test-Path $NextBuildId)
        ) {
            Write-Ok "ForgeUI Studio production build completed"
        }
        else {
            Write-Failure `
                "ForgeUI Studio build failed" `
                "Review the npm build output above. ForgeUI was not started."
        }
    }
}
elseif (
    (-not $Repair) -and
    (-not (Test-Path $NextBuildId))
) {
    Write-Failure `
        "ForgeUI production build is missing" `
        "Run FIRST_TIME_FORGEUI_SETUP.bat to create it."
}

Write-Section "PYTHON IMAGE CONVERTER"

$PythonCommand = Get-PythonCommand

if ($PythonCommand) {
    $PythonVersion = & $PythonCommand --version 2>&1
    Write-Ok "Python found: $PythonVersion"

    if (
        $PythonCommand -match "^[A-Za-z]:\\" -and
        (Test-Path $PythonCommand)
    ) {
        Write-Host "          Path: $PythonCommand" -ForegroundColor Gray
    }
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
        if (
            Test-PythonPackage `
                $PythonCommand `
                $Package.Import
        ) {
            Write-Ok "Python package found: $($Package.Display)"
        }
        elseif ($Repair) {
            Write-WarningMessage `
                "Python package missing: $($Package.Display)"

            if (
                Install-PythonPackage `
                    $PythonCommand `
                    $Package.Install
            ) {
                Write-Ok `
                    "Python package installed: $($Package.Display)"
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

    Write-Ok `
        "OPENAI_API_KEY found in the Windows environment"
}

if (Test-Path $EnvFile) {
    $EnvContent = Get-Content `
        $EnvFile `
        -ErrorAction SilentlyContinue

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

            Write-Ok `
                "OpenAI key configured in studio\.env.local"
        }
    }
}

if (-not $OpenAiKeyFound) {
    Write-WarningMessage `
        "OpenAI API key is not configured"

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
    Write-Ok `
        "OpenAI npm dependency declared in package.json"
}
else {
    Write-WarningMessage `
        "The OpenAI npm dependency was not detected in package.json"
}

Write-Section "PORTS AND RUNNING SERVICES"

if (Test-PortInUse 3000) {
    Write-WarningMessage "Port 3000 is already in use"

    Write-Host `
        "          ForgeUI Studio or another web server may already be running." `
        -ForegroundColor Gray
}
else {
    Write-Ok "Port 3000 is available"
}

if (Test-PortInUse 3030) {
    Write-WarningMessage "Port 3030 is already in use"

    Write-Host `
        "          ForgeUI export-server may already be running." `
        -ForegroundColor Gray
}
else {
    Write-Ok "Port 3030 is available"
}

Write-Section "ESP-IDF STANDALONE EXPORT SUPPORT"

$EspIdfPath = $null
$EspIdfVersion = $null

if (
    $env:IDF_PATH -and
    (Test-Path $env:IDF_PATH)
) {
    $EspIdfPath = $env:IDF_PATH
}

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

if ($EspIdfPath) {
    $VersionFile = Join-Path `
        $EspIdfPath `
        "version.txt"

    if (Test-Path $VersionFile) {
        $EspIdfVersion = (
            Get-Content `
                $VersionFile `
                -ErrorAction SilentlyContinue |
            Select-Object -First 1
        ).Trim()
    }

    if (-not $EspIdfVersion) {
        $GitDirectory = Join-Path `
            $EspIdfPath `
            ".git"

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

    Write-Host `
        "          Path: $EspIdfPath" `
        -ForegroundColor Gray

    if (
        $env:IDF_PATH -or
        (Test-CommandAvailable "idf.py")
    ) {
        Write-Ok "ESP-IDF build environment is active"
    }
    else {
        Write-Host ""
        Write-Host `
            "[INFO]    ESP-IDF is installed but this shell is not activated." `
            -ForegroundColor Cyan

        Write-Host `
            "          Open an ESP-IDF PowerShell or use the ESP-IDF VS Code extension" `
            -ForegroundColor Gray

        Write-Host `
            "          before building or flashing a standalone export." `
            -ForegroundColor Gray
    }

    Write-Host ""
    Write-Host `
        "          Standalone export workflow available:" `
        -ForegroundColor Green

    Write-Host "            ForgeUI Studio" -ForegroundColor Gray
    Write-Host "                -> Export ESP-IDF Project" -ForegroundColor Gray
    Write-Host "                -> Open exported project independently" -ForegroundColor Gray
    Write-Host "                -> Add custom I/O and application code" -ForegroundColor Gray
    Write-Host "                -> Build and flash without ForgeUI Studio" -ForegroundColor Gray
}
else {
    Write-WarningMessage `
        "ESP-IDF 5.5.x installation was not found"

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
}

Write-Section "RESULT"

if ($CriticalFailures -eq 0) {
    Write-Host ""
    Write-Host "FORGEUI PREFLIGHT PASSED" -ForegroundColor Green
    Write-Host ""
    Write-Host "Warnings: $Warnings" -ForegroundColor Yellow
    Write-Host ""
    Write-Host `
        "ForgeUI Studio has the required dependencies to start." `
        -ForegroundColor Green

    if ($Repair -and (Test-Path $NextBuildId)) {
        Write-Host ""

        $StartForgeUI = Read-Host "Start ForgeUI Studio now? [Y/N]"

        if ($StartForgeUI -match "^[Yy]") {
            $Starter = Join-Path `
                $ProjectRoot `
                "START_FORGEUI_STUDIO_HIDDEN.vbs"

            if (Test-Path $Starter) {
                Start-Process `
                    "wscript.exe" `
                    -ArgumentList "`"$Starter`""

                Write-Host `
                    "ForgeUI Studio startup requested." `
                    -ForegroundColor Green
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