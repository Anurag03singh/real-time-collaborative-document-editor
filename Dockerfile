# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install dependencies
RUN npm run install-all

# Copy source code
COPY . .

# Set environment variable for client build
ENV REACT_APP_SERVER_URL=http://localhost:3001

# Build the client
RUN npm run build

# Expose port
EXPOSE 3001

# Start the server
CMD ["npm", "start"]
