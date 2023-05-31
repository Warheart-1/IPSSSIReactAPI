param (
    [Parameter(Mandatory=$true)]
    [string]$commitMessage
)

# Set the path to your local repository
$repoPath = "C:\Users\Axels\ProjectIPSSIReact\projectreactipssi\ProjectTODO"

# Set the remote repository URL
$remoteUrl = "https://github.com/Warheart-1/IPSSSIReactAPI.git"

# Change to the repository directory
cd $repoPath

# Add all changes to the staging area
git add .

# Commit the changes with the provided commit message
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit -m "$commitMessage ($timestamp)"

# Set the remote repository URL
git remote add origin $remoteUrl

# Push the changes to the remote repository using your GitHub credentials
git push origin master --force