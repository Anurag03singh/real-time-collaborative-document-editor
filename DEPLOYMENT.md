# Deployment Guide

This guide covers different deployment options for the Google Docs Clone application.

## Prerequisites

- Node.js 14+ installed
- MongoDB database (local or cloud)
- Git repository access

## Environment Variables

Before deploying, set up these environment variables:

### Server Variables
- `PORT`: Server port (default: 3001)
- `MONGODB_URI`: MongoDB connection string
- `CLIENT_URL`: Frontend URL for CORS

### Client Variables
- `REACT_APP_SERVER_URL`: Backend server URL

## Deployment Options

### 1. Heroku Deployment

#### Step 1: Prepare for Heroku
```bash
# Install Heroku CLI
# Create Heroku app
heroku create your-app-name

# Add MongoDB addon (MongoDB Atlas recommended)
heroku addons:create mongolab:sandbox
```

#### Step 2: Set Environment Variables
```bash
heroku config:set MONGODB_URI="your-mongodb-connection-string"
heroku config:set CLIENT_URL="https://your-app-name.herokuapp.com"
heroku config:set REACT_APP_SERVER_URL="https://your-app-name.herokuapp.com"
```

#### Step 3: Deploy
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### 2. Vercel Deployment (Frontend) + Railway/Render (Backend)

#### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `cd client && npm run build`
3. Set output directory: `client/build`
4. Add environment variable: `REACT_APP_SERVER_URL`

#### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set build command: `cd server && npm install`
3. Set start command: `cd server && npm start`
4. Add environment variables:
   - `MONGODB_URI`
   - `CLIENT_URL`
   - `PORT`

### 3. Docker Deployment

#### Using Docker Compose
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Using Docker
```bash
# Build image
docker build -t google-docs-clone .

# Run with MongoDB
docker run -d --name mongodb mongo:5.0
docker run -d --name app --link mongodb -p 3001:3001 \
  -e MONGODB_URI=mongodb://mongodb:27017/google-docs-clone \
  google-docs-clone
```

### 4. Traditional VPS Deployment

#### Step 1: Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Step 2: Deploy Application
```bash
# Clone repository
git clone <your-repo-url>
cd google-docs-clone

# Install dependencies
npm run install-all

# Build client
npm run build

# Set environment variables
export MONGODB_URI="mongodb://localhost/google-docs-clone"
export CLIENT_URL="http://your-domain.com"
export REACT_APP_SERVER_URL="http://your-domain.com"

# Start application
npm start
```

#### Step 3: Process Management (PM2)
```bash
# Install PM2
npm install -g pm2

# Start application with PM2
pm2 start server/server.js --name "google-docs-server"

# Save PM2 configuration
pm2 save
pm2 startup
```

## MongoDB Setup

### Local MongoDB
```bash
# Start MongoDB
sudo systemctl start mongod

# Create database
mongo
use google-docs-clone
```

### MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` environment variable

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CLIENT_URL` matches your frontend URL exactly
   - Check for trailing slashes in URLs

2. **MongoDB Connection Issues**
   - Verify MongoDB is running
   - Check connection string format
   - Ensure network access is allowed (for cloud MongoDB)

3. **Socket.IO Connection Issues**
   - Verify `REACT_APP_SERVER_URL` is correct
   - Check if ports are properly exposed
   - Ensure WebSocket support is enabled

4. **Build Failures**
   - Check Node.js version compatibility
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall

### Logs and Debugging

```bash
# View application logs
pm2 logs google-docs-server

# View MongoDB logs
sudo journalctl -u mongod

# Check port usage
netstat -tulpn | grep :3001
```

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong MongoDB passwords
   - Rotate credentials regularly

2. **CORS Configuration**
   - Only allow necessary origins
   - Avoid using wildcard (*) in production

3. **MongoDB Security**
   - Enable authentication
   - Use SSL/TLS connections
   - Restrict network access

## Monitoring

1. **Application Health**
   - Set up health check endpoints
   - Monitor memory and CPU usage
   - Track error rates

2. **Database Monitoring**
   - Monitor connection count
   - Track query performance
   - Set up alerts for failures

## Scaling

1. **Horizontal Scaling**
   - Use load balancers
   - Implement session affinity for Socket.IO
   - Consider Redis for session storage

2. **Database Scaling**
   - Use MongoDB replica sets
   - Implement read replicas
   - Consider sharding for large datasets
