# Instructions to Push KhetGPT to GitHub

Since you've already created the repository at https://github.com/adity1605/KhetGPT, follow these steps to push your code:

## Step 1: Create a Personal Access Token (PAT)
1. Go to GitHub  Settings  Developer settings  Personal access tokens  Generate new token
2. Give it a name like 'KhetGPT Push Access'
3. Select repo, workflow, and user scopes
4. Click 'Generate token' and **copy the token immediately** (you won't see it again)

## Step 2: Update your remote URL with your credentials
Run this command in PowerShell, replacing USERNAME with your GitHub username and TOKEN with the PAT you created:

`
git remote set-url origin https://USERNAME:TOKEN@github.com/adity1605/KhetGPT.git
`

## Step 3: Push your code
`
git push -u origin master
`

## Alternative: Use GitHub Desktop
You can also use GitHub Desktop to push your code:
1. Download and install GitHub Desktop from https://desktop.github.com/
2. Add your local repository (C:\Users\adity\Downloads\SIH)
3. Push to the remote repository

Your code should now be available at https://github.com/adity1605/KhetGPT
