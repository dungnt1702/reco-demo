# Quet secret + bug pattern JS truoc khi push. Chay local (repo nay khong co CI).
#   .\security-check.ps1
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

Write-Host "=== gitleaks (secret scan) ===" -ForegroundColor Cyan
& gitleaks detect --source $root -v --redact
if ($LASTEXITCODE -ne 0) { Write-Host "gitleaks: co finding, xem log tren" -ForegroundColor Red }
else { Write-Host "gitleaks: PASS" -ForegroundColor Green }

Write-Host ""
Write-Host "=== semgrep (JS security patterns: sales-hub, recohr) ===" -ForegroundColor Cyan
& semgrep --config auto sales-hub/assets sales-hub/gd01 sales-hub/gd02 sales-hub/tools sales-hub/build-artifact.mjs recohr
if ($LASTEXITCODE -ne 0) { Write-Host "semgrep: co finding, xem log tren (baseline hien co: sales-hub/assets/reco.js, xem AGENTS.md)" -ForegroundColor Yellow }
else { Write-Host "semgrep: PASS" -ForegroundColor Green }
