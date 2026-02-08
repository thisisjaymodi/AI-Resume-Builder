# Use Node.js 18 on Alpine Linux (lightweight)
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the backend code
COPY . .

# Expose port 5000 (standard for Express)
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
