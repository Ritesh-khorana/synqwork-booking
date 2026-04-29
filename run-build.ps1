$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$nodePath = Join-Path $projectRoot ".tools\node"

if (-not (Test-Path (Join-Path $nodePath "node.exe"))) {
  Write-Error "Portable Node.js was not found in .tools\node. Please ask Codex to re-bootstrap the runtime."
  exit 1
}

$env:Path = "$nodePath;$env:Path"

Set-Location $projectRoot
& (Join-Path $nodePath "npm.cmd") run build
