param(
  [string]$RepoPath = "C:\Users\user\Desktop\HK Digital Store",
  [string]$Branch = "master"
)

$ErrorActionPreference = "Stop"

$lockPath = Join-Path $env:TEMP "hk-digital-store-auto-sync.lock"
$logPath = Join-Path $RepoPath "auto-sync.log"

function Write-Log {
  param([string]$Message)
  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  Add-Content -Path $logPath -Value "[$timestamp] $Message"
}

if (Test-Path $lockPath) {
  $lockAge = (Get-Date) - (Get-Item $lockPath).LastWriteTime
  if ($lockAge.TotalMinutes -lt 10) {
    exit 0
  }
  Remove-Item -LiteralPath $lockPath -Force
}

New-Item -Path $lockPath -ItemType File -Force | Out-Null

try {
  Set-Location -LiteralPath $RepoPath

  git rev-parse --is-inside-work-tree *> $null

  $changes = git status --porcelain
  if (-not $changes) {
    exit 0
  }

  git add -A

  git diff --cached --quiet
  if ($LASTEXITCODE -eq 0) {
    exit 0
  }

  $message = "Auto sync $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
  git commit -m $message

  git push origin $Branch
  if ($LASTEXITCODE -ne 0) {
    Write-Log "Push failed, trying pull --rebase then push."
    git pull --rebase --autostash origin $Branch
    git push origin $Branch
  }

  Write-Log "Synced changes to origin/$Branch."
}
catch {
  Write-Log "ERROR: $($_.Exception.Message)"
  exit 1
}
finally {
  if (Test-Path $lockPath) {
    Remove-Item -LiteralPath $lockPath -Force
  }
}
