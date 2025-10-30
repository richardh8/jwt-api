# Development stage
FROM node:20-alpine

WORKDIR /usr/src/app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies including devDependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Create necessary directories
RUN mkdir -p /usr/src/app/logs && \
    mkdir -p /usr/src/app/ssl && \
    chown -R node:node /usr/src/app

# Switch to non-root user
USER node

# Expose HTTPS port
EXPOSE 3443

# Start the application with nodemon for development
CMD ["npm", "run", "dev"]
