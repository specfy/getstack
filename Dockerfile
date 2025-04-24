# Use the official Node.js 22 image as the base image
FROM node:22.15.0-bookworm-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY apps/backend/package.json ./apps/backend/package.json

# Install dependencies
RUN npm install

# Copy the entire repository to the working directory
COPY . ./

RUN npm run build:back

# Clean dev dependencies
RUN true \
  && npm prune --omit=dev --omit=peer --omit=optional

# Expose the port the backend service runs on
EXPOSE 3000

# Set the command to run the backend service
CMD ["node", "--run", "prod:start"]
