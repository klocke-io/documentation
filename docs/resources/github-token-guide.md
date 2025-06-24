# Creating a GitHub Token for Docforge

Docforge requires a GitHub token to increase the rate limit for the GitHub API when downloading documentation from repositories. This guide explains how to create a classic GitHub personal access token.

## Steps to create a GitHub Token

1. Go to your GitHub account settings by clicking on your profile picture in the top right corner and selecting "Settings".
2. In the left sidebar, click on "Developer settings".
3. Click on "Personal access tokens" and then "Tokens (classic)".
4. Click "Generate new token" and then "Generate new token (classic)".
5. Give your token a descriptive name, for example, "Docforge Documentation".
6. **No specific permissions are required for this token**. Its main purpose is to increase the rate limit for API calls.
7. Click "Generate token".
8. **Important**: Copy the token immediately, as you won't be able to see it again.

## Setting the Token Permanently

For convenience, you can add the GitHub token to your shell profile for persistent access:

### For Zsh (macOS default)
```bash
echo 'export GITHUB_OAUTH_TOKEN=your_token_here' >> ~/.zshrc
source ~/.zshrc
```

### For Bash
```bash
echo 'export GITHUB_OAUTH_TOKEN=your_token_here' >> ~/.bashrc
source ~/.bashrc
```

### For Fish shell
```fish
set -Ux GITHUB_OAUTH_TOKEN your_token_here
```

## Using the Token

The `make docforge` command will check if the token is already set in your environment. If not, you'll be prompted to enter it for temporary use.

## Security Note

* Never commit your GitHub token to version control
* Store the token securely in your environment variables or shell profile
* If you suspect your token has been compromised, revoke it immediately in your GitHub settings
