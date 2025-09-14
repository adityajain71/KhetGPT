# Detailed GitHub Upload Instructions

## The Problem
You're getting a "Permission denied" error when trying to push to GitHub because the current Git configuration is trying to use a different GitHub account (adityajain71) than the one that owns the repository (adity1605).

## Solution 1: Update the Remote URL with a Personal Access Token

1. **Create a Personal Access Token (PAT)**
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Generate new token
   - Give it a name like 'KhetGPT Push Access'
   - Select 'repo' and 'workflow' scopes
   - Click 'Generate token' and **copy the token immediately**

2. **Update the Remote URL with Your Credentials**
   ```powershell
   git remote set-url origin https://adity1605:YOUR_TOKEN@github.com/adity1605/KhetGPT.git
   ```
   Replace `YOUR_TOKEN` with the PAT you created.

3. **Push Your Code**
   ```powershell
   git push -u origin main
   ```

## Solution 2: Use GitHub Desktop

1. **Download and Install GitHub Desktop**
   - Download from https://desktop.github.com/
   
2. **Add Your Local Repository**
   - Open GitHub Desktop
   - Click "File" → "Add Local Repository"
   - Browse to `C:\Users\adity\Downloads\SIH`
   
3. **Authenticate with Your GitHub Account**
   - Sign in to GitHub Desktop with your adity1605 account
   
4. **Push to GitHub**
   - Click "Publish repository" in the top right
   - Ensure the GitHub.com tab is selected
   - Select your repository name "KhetGPT"
   - Click "Publish repository"

## Solution 3: Manual Upload via GitHub Web Interface

If the above solutions don't work, you can manually upload your files:

1. **Go to Your Repository**
   - Visit https://github.com/adity1605/KhetGPT

2. **Upload Files**
   - Click "Add file" → "Upload files"
   - Drag and drop your files or browse to select them
   - Commit the changes

## Important Files to Upload

Make sure to include these key files and folders:
- khedgpt-frontend/
- khetgpt-backend/
- README.md
- .gitignore

Feel free to exclude:
- node_modules/
- venv/
- __pycache__/
- Other temporary files