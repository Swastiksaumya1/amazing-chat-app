# Deployment Guide

This guide will walk you through deploying the chat application backend to a production environment.

## Prerequisites

- Node.js (v16 or higher) installed on the server
- MongoDB database (local or cloud-based)
- PM2 (for process management)
- Nginx (as a reverse proxy, optional but recommended)
- Domain name with DNS configured (optional)
- SSL certificate (recommended for production)

## 1. Server Setup

### 1.1 Update System Packages

```bash
sudo apt update
sudo apt upgrade -y
```

### 1.2 Install Node.js and npm

```bash
# Using NodeSource
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node -v
npm -v
```

### 1.3 Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

### 1.4 Install Nginx (Optional but recommended)

```bash
sudo apt install nginx -y
```

## 2. Database Setup

### 2.1 Install MongoDB (if using a local database)

```bash
# Import the public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update and install
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 2.2 Set up a Cloud Database (Alternative)

If you prefer a cloud database, you can use MongoDB Atlas:

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a new cluster
3. Create a database user
4. Whitelist your server's IP address
5. Get the connection string

## 3. Deploy the Application

### 3.1 Clone the Repository

```bash
# Navigate to your preferred directory
cd /opt

# Clone the repository
sudo git clone <your-repository-url> chat-app
cd chat-app/server

# Install dependencies
npm install --production
```

### 3.2 Configure Environment Variables

Create a `.env` file in the server directory:

```bash
NODE_ENV=production
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=https://your-frontend-domain.com
```

### 3.3 Build the TypeScript Code

```bash
npm run build
```

### 3.4 Start the Application with PM2

```bash
# Start the application
pm2 start dist/server.js --name "chat-app-backend"

# Save the PM2 process list
pm2 save

# Set up PM2 to start on boot
pm2 startup
# (Follow the instructions provided by the above command)
```

## 4. Configure Nginx (Recommended)

### 4.1 Create an Nginx Configuration File

```bash
sudo nano /etc/nginx/sites-available/chat-app
```

Add the following configuration (adjust domain names as needed):

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4.2 Enable the Site

```bash
sudo ln -s /etc/nginx/sites-available/chat-app /etc/nginx/sites-enabled/
sudo nginx -t  # Test the configuration
sudo systemctl restart nginx
```

## 5. Set Up SSL with Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain and install certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test automatic renewal
sudo certbot renew --dry-run
```

## 6. Configure Firewall

```bash
# Allow SSH
sudo ufw allow OpenSSH

# Allow HTTP/HTTPS
sudo ufw allow 'Nginx Full'

# Enable the firewall
sudo ufw enable
```

## 7. Monitoring and Maintenance

### 7.1 Monitor Logs

```bash
# View application logs
pm2 logs

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### 7.2 Update the Application

```bash
# Pull the latest changes
cd /opt/chat-app/server
git pull

# Install new dependencies
npm install --production

# Rebuild the application
npm run build

# Restart the application
pm2 restart chat-app-backend
```

## 8. Environment Variables Reference

| Variable     | Description                     | Required | Default                     |
|--------------|---------------------------------|----------|----------------------------|
| NODE_ENV     | Node environment                | Yes      | production                 |
| PORT         | Server port                     | Yes      | 5000                       |
| MONGO_URI    | MongoDB connection string        | Yes      | -                          |
| JWT_SECRET   | Secret key for JWT signing      | Yes      | -                          |
| CLIENT_URL   | Frontend URL for CORS           | Yes      | http://localhost:3000      |

## 9. Troubleshooting

### Application won't start

1. Check logs: `pm2 logs`
2. Verify MongoDB connection
3. Check if the port is in use: `sudo lsof -i :5000`

### Nginx 502 Bad Gateway

1. Check if the Node.js app is running: `pm2 list`
2. Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify Nginx configuration: `sudo nginx -t`

### SSL Certificate Issues

1. Check certificate status: `sudo certbot certificates`
2. Renew certificates: `sudo certbot renew`

## 10. Security Considerations

1. Keep your server and dependencies updated
2. Use strong passwords and JWT secrets
3. Regularly back up your database
4. Monitor server resources and logs
5. Implement rate limiting if needed
6. Keep your SSL certificates up to date
