@echo off
echo ========================================
echo    MFA Solutions - Quick Deploy
echo ========================================
echo.

REM Check if git is initialized
if not exist ".git" (
    echo [Step 1/5] Initializing Git repository...
    git init
    if errorlevel 1 (
        echo ERROR: Git initialization failed. Is Git installed?
        pause
        exit /b 1
    )
    echo ✓ Git initialized
    echo.
) else (
    echo ✓ Git already initialized
    echo.
)

REM Check if remote exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo [Step 2/5] Setting up GitHub remote...
    echo.
    echo Please enter your GitHub repository URL:
    echo Example: https://github.com/username/mfa-solutions.git
    set /p repo_url="Repository URL: "
    
    if "%repo_url%"=="" (
        echo ERROR: Repository URL cannot be empty
        pause
        exit /b 1
    )
    
    git remote add origin %repo_url%
    if errorlevel 1 (
        echo ERROR: Failed to add remote
        pause
        exit /b 1
    )
    echo ✓ Remote added
    echo.
) else (
    echo ✓ Remote already configured
    echo.
)

echo [Step 3/5] Adding files to Git...
git add .
if errorlevel 1 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)
echo ✓ Files added
echo.

echo [Step 4/5] Committing changes...
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg=Deploy: %date% %time%

git commit -m "%commit_msg%"
if errorlevel 1 (
    echo Note: No changes to commit or commit failed
)
echo ✓ Changes committed
echo.

echo [Step 5/5] Pushing to GitHub...
git branch -M main
git push -u origin main
if errorlevel 1 (
    echo ERROR: Failed to push to GitHub
    echo.
    echo Common issues:
    echo - Authentication failed: Use Personal Access Token instead of password
    echo - Remote already exists: Try 'git push' without -u flag
    echo - Branch conflicts: Try 'git pull origin main' first
    pause
    exit /b 1
)

echo.
echo ========================================
echo    ✓ Deployment Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Go to https://vercel.com
echo 2. Click "Add New Project"
echo 3. Import your GitHub repository
echo 4. Click "Deploy"
echo.
echo Your site will be live in ~30 seconds!
echo.
pause
