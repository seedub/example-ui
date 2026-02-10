# Deployment Setup

This document describes how to set up the GitHub Actions deployment pipeline to your AWS instance.

## Prerequisites

1. **AWS Instance Setup**
   - Instance IP: [Your AWS instance IP]
   - SSH access configured
   - Nginx installed
   - User: [Your EC2 user, typically ec2-user for Amazon Linux]

2. **GitHub Repository Secrets**
   
   You need to add the following secrets to your GitHub repository:
   
   - `SSH_KEY`: Your SSH private key for accessing the AWS instance
   - `AWS_HOST`: Your AWS instance IP address (e.g., 35.90.6.81)
   - `AWS_USER`: Your AWS instance user (e.g., ec2-user for Amazon Linux)

   To add these secrets:
   1. Go to your repository on GitHub
   2. Navigate to Settings → Secrets and variables → Actions
   3. Click "New repository secret"
   4. Add each of the three secrets listed above:
      - Name: `SSH_KEY`, Value: Paste your entire SSH private key (the contents of your .pem file)
      - Name: `AWS_HOST`, Value: Your AWS instance IP address
      - Name: `AWS_USER`, Value: Your AWS instance username

## AWS Instance Setup

On your AWS instance, ensure the following are set up:

1. **Install Nginx** (if not already installed):
   ```bash
   sudo yum install nginx -y
   sudo systemctl enable nginx
   sudo systemctl start nginx
   ```

2. **Configure firewall** (if applicable):
   ```bash
   sudo firewall-cmd --permanent --add-service=http
   sudo firewall-cmd --reload
   ```

3. **Ensure EC2 Security Group allows HTTP (port 80)** in AWS Console

**Note**: The web directory `/var/www/example-ui` will be created automatically during the first deployment. You don't need to create it manually.

## Nginx Configuration

The nginx configuration file is located at `nginx/example-ui.conf` in this repository.

During deployment, this file is automatically copied to `/etc/nginx/conf.d/example-ui.conf` on your AWS instance.

The configuration:
- Serves the built React app from `/var/www/example-ui`
- Handles React Router client-side routing
- Enables gzip compression
- Sets appropriate caching headers for assets
- Includes basic security headers

## GitHub Actions Workflow

The workflow is defined in `.github/workflows/deploy.yml` and includes three jobs:

### 1. Lint and Test
- Checks out code
- Installs dependencies
- Runs ESLint
- Runs tests (if present)

### 2. Build
- Builds the React application using Vite
- Uploads build artifacts for deployment

### 3. Deploy
- Downloads build artifacts
- SSHs to AWS instance
- Copies built files to temporary directory
- Uses sudo to move files to `/var/www/example-ui`
- Updates nginx configuration
- Sets proper file permissions
- Reloads nginx

## Triggering Deployment

The workflow runs on:
- **Push to main branch**: Automatically deploys to AWS
- **Pull requests**: Runs linting, testing, and building (no deployment)
- **Manual trigger**: Can be triggered manually from GitHub Actions tab

## Manual Deployment

If you need to deploy manually:

1. Build the application locally:
   ```bash
   npm install
   npm run build
   ```

2. Copy files to the server temporary directory:
   ```bash
   ssh -i /path/to/key.pem <AWS_USER>@<AWS_HOST> "mkdir -p /tmp/example-ui-deploy"
   scp -i /path/to/key.pem -r dist/* <AWS_USER>@<AWS_HOST>:/tmp/example-ui-deploy/
   ```

3. Update nginx config and move files:
   ```bash
   scp -i /path/to/key.pem nginx/example-ui.conf <AWS_USER>@<AWS_HOST>:/tmp/
   ssh -i /path/to/key.pem <AWS_USER>@<AWS_HOST> << 'EOF'
   sudo mkdir -p /var/www/example-ui
   sudo rsync -a --delete /tmp/example-ui-deploy/ /var/www/example-ui/
   rm -rf /tmp/example-ui-deploy
   sudo mv /tmp/example-ui.conf /etc/nginx/conf.d/example-ui.conf
   sudo chown -R nginx:nginx /var/www/example-ui
   sudo chmod -R 755 /var/www/example-ui
   sudo nginx -t
   sudo systemctl reload nginx
   EOF
   ```

## Troubleshooting

1. **SSH connection fails**: Verify security group allows SSH (port 22) from GitHub Actions IPs
2. **Nginx fails to reload**: Check logs at `/var/log/nginx/error.log`
3. **403 Forbidden**: Check file permissions on `/var/www/example-ui`
4. **404 on routes**: Ensure nginx configuration has the `try_files` directive for React Router

## Accessing Your Application

After successful deployment, your application will be available at:
- http://\<AWS_HOST\>

Replace `<AWS_HOST>` with your AWS instance IP address.

If you have a domain name, update the `server_name` directive in `nginx/example-ui.conf` and configure your DNS to point to the instance IP.
