# PowerShell script to push to GitHub
Write-Host "============================================="
Write-Host "GitHub Push Helper for KhetGPT Repository"
Write-Host "============================================="
Write-Host ""

# Ask for GitHub username
Write-Host "Please enter your GitHub username: " -NoNewline
$username = Read-Host

# Ask for GitHub token
Write-Host "Please enter your GitHub Personal Access Token: " -NoNewline
$token = Read-Host -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
$plainToken = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Update the remote URL with credentials
Write-Host "
Updating remote URL with your credentials..."
git remote set-url origin "https://$username:$plainToken@github.com/adity1605/KhetGPT.git"

# Push to GitHub
Write-Host "
Pushing to GitHub..."
git push -u origin main

Write-Host "
Done! Check your repository at https://github.com/adity1605/KhetGPT"
