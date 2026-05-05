# Install claude-skills-supreme into $HOME\.claude\skills\
# Usage:
#   .\install.ps1                    # install all 9
#   .\install.ps1 -Fusions           # only validated fusions
#   .\install.ps1 -Meta              # only meta skills
#   .\install.ps1 -Skill code-review-supreme

param(
    [switch]$Fusions,
    [switch]$Meta,
    [switch]$All,
    [string]$Skill,
    [switch]$Help
)

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Target = Join-Path $env:USERPROFILE ".claude\skills"

if (-not (Test-Path $Target)) {
    New-Item -ItemType Directory -Force -Path $Target | Out-Null
}

$FUSIONS = @(
    "code-review-supreme",
    "planning-supreme",
    "debugging-supreme",
    "simplify-supreme"
)

$META = @(
    "coach",
    "skill-fusion",
    "plugin-fusion",
    "skill-review",
    "skill-creation-supreme"
)

$ALL = $FUSIONS + $META

function Install-Skill {
    param([string]$Name)
    $src = Join-Path $ScriptDir "skills\$Name"
    $dest = Join-Path $Target $Name

    if (-not (Test-Path $src)) {
        Write-Host "[X] skill not found: $Name" -ForegroundColor Red
        return
    }

    if (Test-Path $dest) {
        Write-Host "[-] $Name (already installed - skipping)" -ForegroundColor Yellow
        return
    }

    Copy-Item -Recurse $src $dest
    Write-Host "[+] installed: $Name" -ForegroundColor Green
}

if ($Help) {
    @"
Usage: .\install.ps1 [option]

Options:
  (no arg)             Install all 9 skills
  -All                 Same as no arg
  -Fusions             Install only validated fusions (4)
  -Meta                Install only meta skills (5)
  -Skill <name>        Install specific skill
  -Help                Show this help

After install, restart Claude Code to load new skills.
"@
    exit 0
}

if ($Skill) {
    Install-Skill $Skill
}
elseif ($Fusions) {
    Write-Host "Installing 4 validated fusions..."
    $FUSIONS | ForEach-Object { Install-Skill $_ }
}
elseif ($Meta) {
    Write-Host "Installing 5 meta skills..."
    $META | ForEach-Object { Install-Skill $_ }
}
else {
    Write-Host "Installing all 9 skills..."
    $ALL | ForEach-Object { Install-Skill $_ }
}

Write-Host ""
Write-Host "Done. Restart Claude Code to load new skills." -ForegroundColor Cyan
Write-Host "Test with: /skill-review (validate any skill empirically)"
