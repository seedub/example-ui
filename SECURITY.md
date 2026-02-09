# Security Policy

## Protecting Sensitive Information

This repository follows security best practices to prevent credential leaks:

### What NOT to Commit

Never commit the following to this repository:

- **Environment files**: `.env`, `.env.local`, `.env.production`, etc.
- **Private keys**: `.pem`, `.key`, `id_rsa`, etc.
- **Certificates**: `.p12`, `.pfx`, etc.
- **API keys and tokens**: Hardcoded in source files
- **Passwords and secrets**: In configuration files or code
- **AWS credentials**: Access keys, secret keys, session tokens

### Using GitHub Secrets

Store sensitive information as GitHub repository secrets:

1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add your secrets

Current secrets required for this project:
- `SSH_KEY`: SSH private key for AWS deployment
- `AWS_HOST`: AWS instance IP address
- `AWS_USER`: AWS instance username

### .gitignore Protection

The `.gitignore` file is configured to prevent common credential files from being committed:

- Environment variable files (`.env*`)
- Private keys (`.pem`, `.key`, `id_rsa`)
- Certificate files (`.p12`, `.pfx`)
- Credential directories (`secrets/`, `credentials/`)

### Checking for Leaked Credentials

If you accidentally commit sensitive information:

1. **Remove the file from git history** (use tools like `git-filter-repo` or BFG Repo-Cleaner)
2. **Rotate the compromised credentials immediately**
3. **Add the file pattern to `.gitignore`**
4. **Force push the cleaned history** (coordinate with team members)

### Best Practices

1. **Use environment variables** for configuration that changes between environments
2. **Store secrets in GitHub Secrets** or a secure secret management system
3. **Review commits** before pushing to ensure no sensitive data is included
4. **Enable secret scanning** in GitHub repository settings
5. **Regularly audit** repository for accidentally committed credentials
6. **Use `.env.example`** files to document required environment variables (without values)

## Reporting a Security Vulnerability

If you discover a security vulnerability in this project, please report it by:

1. Creating a private security advisory in this repository
2. Or emailing the repository maintainers

Please do not create public issues for security vulnerabilities.

## Security Updates

This project is scanned for vulnerabilities in dependencies. Keep dependencies up to date:

```bash
npm audit
npm audit fix
```

## Additional Resources

- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security/getting-started/securing-your-organization)
- [OWASP Security Guidelines](https://owasp.org/)
