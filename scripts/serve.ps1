# Serve the static portfolio locally on port 8000
# Usage: Open PowerShell at the project root and run:
#   .\scripts\serve.ps1

param(
  [int]$Port = 8000
)

Write-Host "Starting local static server on http://localhost:$Port ..."

# If Python is available, use the built-in http.server (works on Windows with Python 3+)
# This will block the terminal until you Ctrl+C to stop the server.
try{
  # Try Python 3 command
  & python -m http.server $Port
} catch {
  Write-Host "Python not found or failed. Try installing Python 3, or run: 'npx serve -s .' after installing serve via npm." -ForegroundColor Yellow
}
