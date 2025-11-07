# Development stage
FROM node:20-alpine

WORKDIR /usr/src/app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies including devDependencies
RUN npm install --legacy-peer-deps

# Install tsx globally for the node user
RUN npm install -g tsx

# Create necessary directories
RUN mkdir -p /usr/src/app/logs \
    && mkdir -p /usr/src/app/ssl \
    && chown -R node:node /usr/src/app

# Switch to non-root user
USER node

# Set environment variables
ENV NODE_ENV=development
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# Copy the rest of the application (as non-root)
COPY --chown=node:node . .

# Expose HTTPS port
EXPOSE 3443

# Start the application with nodemon for development
CMD ["tsx", "watch", "src/app.ts"]
